# --- Giai đoạn 1: Build Frontend (React) ---
FROM node:20-alpine AS build-node
WORKDIR /src/client
COPY client/package*.json ./
RUN npm install
COPY client/ ./
RUN npm run build

# --- Giai đoạn 2: Build Backend (.NET) ---
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build-dotnet
WORKDIR /src
# Copy file csproj và restore
COPY ["TreMoc.csproj", "."]
RUN dotnet restore "./TreMoc.csproj"

# Copy toàn bộ mã nguồn C#
COPY . .

# Copy thư mục build của React (client/dist) từ Giai đoạn 1 vào đây
# (Để khi dotnet publish, file .csproj tự động mang theo frontend)
COPY --from=build-node /src/client/dist ./client/dist

# Publish ứng dụng (bao gồm cả C# và React)
RUN dotnet publish "TreMoc.csproj" -c Release -o /app/publish /p:UseAppHost=false

# --- Giai đoạn 3: Runtime image chạy trên Server ---
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final
WORKDIR /app

# Render tự động nhận cổng này
ENV ASPNETCORE_URLS=http://+:10000
EXPOSE 10000

# Copy kết quả cuối cùng từ Giai đoạn 2
COPY --from=build-dotnet /app/publish .

ENTRYPOINT ["dotnet", "TreMoc.dll"]