curl -X PATCH http://localhost:9010/products/694829be684e9da58e164194 \
-H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2OTQxYjZhMWVjM2JmZTkyYTllYThmOTciLCJyb2xlIjoicmVndWxhciIsImlhdCI6MTc2NjMzNzE0MCwiZXhwIjoxNzY2MzQwNzQwfQ.bixVTcDIC9tkB7Ppe6UoRSPCdxRcRXQdcudJr9hC2Cw" \
-H "Content-Type: application/json" \
-d '{"images":["iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg=="],"title":"test title","description":"test15","brand":"test8","price":43,"state":"used","stock":8}' \
-v