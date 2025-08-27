##############################
# Stage 1: Build (for both dev and prod)
FROM golang:1.24-alpine AS builder

# Install git
RUN apk add --no-cache git

# Set environment
ENV CGO_ENABLED=0 GOOS=linux GO111MODULE=on

WORKDIR /app

# Copy go mod files and download dependencies
COPY go.mod go.sum ./
RUN go mod download

# Copy the rest of the app
COPY . .

# Install air for live reload (only used in dev container)
RUN go install github.com/air-verse/air@latest

# Build the production binary
RUN go build -o server .

##############################
# Stage 2: Development container (with Air)
FROM golang:1.23-alpine AS development

WORKDIR /app

# Install git
RUN apk add --no-cache git

# Copy source code
COPY --from=builder /app /app

# Copy Air binary
COPY --from=builder /go/bin/air /usr/bin/air

# Expose the app port
EXPOSE 8080

# Command: run Air (live reload server)
CMD ["air"]

##############################
# Stage 3: Production container (minimal image)
FROM alpine:latest AS production

WORKDIR /root/

# Copy only the final server binary
COPY --from=builder /app/server .

# Expose the app port
EXPOSE 8080

# Command: run the server binary
CMD ["./server"]
