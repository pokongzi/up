package config

import (
	"log"
	"os"
	"path/filepath"

	"gopkg.in/ini.v1"
)

var Config *ini.File

func init() {
	exePath, err := os.Executable()
	if err != nil {
		log.Fatal("无法获取可执行文件路径: ", err)
	}
	baseDir := filepath.Dir(exePath)
	ConfigFile, err := ini.Load(baseDir + "/config/ini.ini")
	// _ = baseDir
	// ConfigFile, err := ini.Load("/Users/guodongming/go/src/up/backend/config/ini.ini")
	if err != nil {
		log.Fatal("未找到配置文件", err)
		return
	}
	Config = ConfigFile
}
