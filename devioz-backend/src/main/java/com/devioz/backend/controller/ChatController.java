package com.devioz.backend.controller;

import com.devioz.backend.dto.ChatRequest;
import com.devioz.backend.dto.ChatResponse;
import com.devioz.backend.service.BotService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/chat")
public class ChatController {

    private final BotService bot;

    public ChatController(BotService bot) {
        this.bot = bot;
    }

    @PostMapping
    public ResponseEntity<ChatResponse> chat(@RequestBody ChatRequest req) {
        System.out.println("🎯 ChatController -> Método chat() EJECUTADO");
        System.out.println("💬 Mensaje recibido: " + req.message());
        
        String reply = bot.ask(req.message());
        System.out.println("🤖 Respuesta generada: " + reply);
        
        return ResponseEntity.ok(new ChatResponse(reply));
    }

    @GetMapping("/test")
    public ResponseEntity<String> test() {
        System.out.println("✅ Endpoint /api/chat/test ejecutado correctamente");
        return ResponseEntity.ok("Test exitoso - El endpoint funciona");
    }
}