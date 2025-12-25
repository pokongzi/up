package main

import (
	"log"

	"up/common/config"
	"up/common/mysql"
	"up/common/redis"

	"github.com/gin-gonic/gin"
)

func main() {
	// 初始化配置
	_ = config.Config

	// 初始化MySQL
	mysql.Init()
	log.Println("MySQL连接成功")

	// 初始化Redis
	redis.Init()
	log.Println("Redis连接成功")

	r := gin.Default()
	gin.SetMode(gin.DebugMode)

	// 注册路由

	log.Println("服务启动在端口 :8888")
	if err := r.Run(":8888"); err != nil {
		log.Fatal("服务启动失败: ", err)
	}
}
