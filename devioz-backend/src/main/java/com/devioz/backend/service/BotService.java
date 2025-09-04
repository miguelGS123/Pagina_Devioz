package com.devioz.backend.service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.apache.lucene.analysis.Analyzer;
import org.apache.lucene.analysis.standard.StandardAnalyzer;
import org.apache.lucene.document.Document;
import org.apache.lucene.document.Field;
import org.apache.lucene.document.StringField;
import org.apache.lucene.document.TextField;
import org.apache.lucene.index.DirectoryReader;
import org.apache.lucene.index.IndexWriter;
import org.apache.lucene.index.IndexWriterConfig;
import org.apache.lucene.queryparser.classic.QueryParser;
import org.apache.lucene.search.IndexSearcher;
import org.apache.lucene.search.Query;
import org.apache.lucene.search.ScoreDoc;
import org.apache.lucene.search.TopDocs;
import org.apache.lucene.store.ByteBuffersDirectory;
import org.apache.lucene.store.Directory;
import org.springframework.stereotype.Service;

import jakarta.annotation.PostConstruct;

import java.io.InputStream;
import java.util.List;
import java.util.Map;

@Service
public class BotService {

    private final Analyzer analyzer = new StandardAnalyzer();
    private Directory memoryIndex;
    private IndexSearcher searcher;

    @PostConstruct
    public void init() {
        try {
            // Cargar FAQs desde JSON
            ObjectMapper mapper = new ObjectMapper();
            InputStream input = getClass().getResourceAsStream("/faq.json");
            List<Map<String, String>> faqs = mapper.readValue(input, new TypeReference<>() {});

            // Crear índice en memoria con ByteBuffersDirectory
            memoryIndex = new ByteBuffersDirectory();
            IndexWriterConfig config = new IndexWriterConfig(analyzer);
            try (IndexWriter writer = new IndexWriter(memoryIndex, config)) {
                for (Map<String, String> faq : faqs) {
                    Document doc = new Document();
                    doc.add(new TextField("question", faq.get("question"), Field.Store.YES));
                    doc.add(new StringField("answer", faq.get("answer"), Field.Store.YES));
                    writer.addDocument(doc);
                }
            }

            // Preparar buscador
            searcher = new IndexSearcher(DirectoryReader.open(memoryIndex));

        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    public String ask(String userQuestion) {
        try {
            QueryParser parser = new QueryParser("question", analyzer);
            Query query = parser.parse(userQuestion);

            TopDocs topDocs = searcher.search(query, 1);
            if (topDocs.scoreDocs.length > 0) {
                ScoreDoc scoreDoc = topDocs.scoreDocs[0];
                Document doc = searcher.doc(scoreDoc.doc);
                return doc.get("answer");
            } else {
                return "Lo siento, no encontré una respuesta. Intenta preguntar de otra forma.";
            }
        } catch (Exception e) {
            e.printStackTrace();
            return "Error en el bot: " + e.getMessage();
        }
    }
}