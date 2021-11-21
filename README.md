# eurasian-test-task

Добавление (Без сессии, для вашего удобства)
POST: http://localhost:3000/main/users
{
	"action": "add",
	"name": "Диас",
	"login": "dias",
	"password": "123456"
}

Авторизация
POST: http://localhost:3000/main/authorization
{
	"action": "signin",
	"login": "dias",
	"password": "123456"
}

Получение список файлов по пользователю
POST: http://localhost:3000/main/files
{
	"action": "getBySession",
	"session_uuid": "c62ce1d4-87fa-49f5-8d67-f0ef283d2f5f"
}

Скачивание файла 
POST: http://localhost:3000/main/files
{
	"action": "downloadBySession",
	"session_uuid": "c62ce1d4-87fa-49f5-8d67-f0ef283d2f5f", 
	"file_id": 1
}

Загрузка файлов
POST: http://localhost:3000/uploadFiles/c62ce1d4-87fa-49f5-8d67-f0ef283d2f5f // SESSION
multipart/form-data
NAME: "multi-files", FILE_1
NAME: "multi-files", FILE_2
NAME: "multi-files", FILE_3
