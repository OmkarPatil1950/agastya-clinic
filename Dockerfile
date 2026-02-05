# --- Build Stage ---
FROM maven:3.9.9-eclipse-temurin-11 AS builder
WORKDIR /app

COPY pom.xml .
RUN mvn -B -e dependency:resolve

COPY src ./src
RUN mvn clean install 

# --- Package Stage ---
FROM eclipse-temurin:11-jre
WORKDIR /app

COPY --from=builder /app/target/*.jar app.jar

EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
