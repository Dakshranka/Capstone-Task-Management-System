FROM eclipse-temurin:17-jre-alpine

WORKDIR /app

# Use a non-root user for better container security.
RUN addgroup -S spring && adduser -S spring -G spring

ARG JAR_FILE=target/capstone-project-backend-0.0.1-SNAPSHOT.jar
COPY ${JAR_FILE} app.jar

EXPOSE 8081

USER spring:spring

ENTRYPOINT ["java", "-jar", "/app/app.jar"]
