FROM maven:4.0.0-rc-5-eclipse-temurin-21 AS maven_build
WORKDIR /app
COPY .mvn/ .mvn
COPY mvnw pom.xml ./
RUN ./mvnw dependency:go-offline
COPY src ./src
RUN ./mvnw clean package -DskipTests

FROM eclipse-temurin:21-jdk-alpine
WORKDIR /app
COPY --from=maven_build /app/target/*.jar app.jar
EXPOSE 7000
ENTRYPOINT ["java", "-jar", "app.jar"]