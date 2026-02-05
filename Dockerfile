# --- Build Stage ---
FROM maven:3.8.1-openjdk-11-slim AS builder
WORKDIR /app
COPY pom.xml .
RUN mvn -e -B dependency:resolve # Resolve dependencies first for better caching
COPY src ./src
RUN mvn clean -e -B install # This command builds and packages the application

# --- Package Stage (final image) ---
FROM openjdk:11-jre-slim-buster
WORKDIR /app
COPY --from=builder /app/target/*.jar app.jar # Copy the built JAR from the builder stage
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
