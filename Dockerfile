# Giai đoạn 1: Chạy ứng dụng (Sử dụng môi trường Linux sạch)
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app
# Render tự động cấp cổng PORT qua môi trường, .NET 8 mặc định nghe cổng 8080 hoặc chúng ta cấu hình cổng 10000
ENV ASPNETCORE_URLS=http://+:10000
EXPOSE 10000

# Giai đoạn 2: Build code (.NET SDK bản Linux)
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
ARG BUILD_CONFIGURATION=Release
WORKDIR /src
COPY ["TreMoc.csproj", "."]
RUN dotnet restore "./TreMoc.csproj"
COPY . .
WORKDIR "/src"
RUN dotnet build "TreMoc.csproj" -c $BUILD_CONFIGURATION -o /app/build

# Giai đoạn 3: Publish ứng dụng
FROM build AS publish
ARG BUILD_CONFIGURATION=Release
RUN dotnet publish "TreMoc.csproj" -c $BUILD_CONFIGURATION -o /app/publish /p:UseAppHost=false

# Giai đoạn cuối: Gom file chạy gọn nhẹ nhất sang máy ảo vận hành
FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "TreMoc.dll"]