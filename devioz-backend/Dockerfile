# --- ETAPA 1: CONSTRUCCIÓN (BUILD) ---
# Usamos Maven con Java 17 (coincide con tu pom.xml)
FROM maven:3.9.6-eclipse-temurin-17 AS build

# Carpeta de trabajo dentro del contenedor
WORKDIR /app

# Copiamos solo el archivo de dependencias primero (para caché eficiente)
COPY pom.xml .

# Descargamos dependencias (esto se guarda en caché de Docker)
RUN mvn dependency:go-offline -B

# Copiamos todo el código fuente
COPY src ./src

# Compilamos el proyecto y creamos el .jar (saltando tests)
RUN mvn clean package -DskipTests

# --- ETAPA 2: EJECUCIÓN (RUN) ---
# Usamos una imagen ligera de Java 17 solo para correr la app
FROM eclipse-temurin:17-jdk-alpine

# Carpeta de trabajo
WORKDIR /app

# Copiamos el .jar generado en la etapa anterior
# (Nota: busca cualquier archivo .jar en target/)
COPY --from=build /app/target/*.jar app.jar

# Exponemos el puerto 8008 (el de tu backend)
EXPOSE 8008

# Comando para iniciar la app
ENTRYPOINT ["java", "-jar", "app.jar"]