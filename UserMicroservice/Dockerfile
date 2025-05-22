# ── Stage 1: build the JAR ────────────────────────────────────────────
FROM maven:3.9-eclipse-temurin-17 AS builder
WORKDIR /build

# copy everything (parent pom + all modules) into the build context
COPY . .

# build only the UserMicroservice module (parent POM is resolved automatically)
RUN mvn -f UserMicroservice/pom.xml clean package -DskipTests

# ── Stage 2: runtime ─────────────────────────────────────────────────
FROM eclipse-temurin:17-jdk
WORKDIR /app

# pull in only the module’s JAR
COPY --from=builder \
     /build/UserMicroservice/target/*.jar \
     ./app.jar

ENTRYPOINT ["java","-jar","/app/app.jar"]
