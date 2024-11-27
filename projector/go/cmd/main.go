package main

import (
	"encoding/json"
	"fmt"
	"github.com/OsmarJoseph/projector/go/pkg/projector"
	"log"
)

func main() {
	opts, err := projector.GetOpts()

	if err != nil {
		log.Fatalf("unable to get options: %v", err)
	}

	config, err := projector.NewConfig(opts)

	if err != nil {
		log.Fatalf("unable to get config: %v", err)
	}

	proj := projector.NewProjector(config)

	if config.Operation == projector.Print {
		if len(config.Args) == 0 {
			data := proj.GetValueAll()

			jsonString, err := json.Marshal(data)
			if err != nil {
				log.Fatalf("unable to marshal data: %v", err)
			}
			fmt.Println(string(jsonString))
		} else if value, ok := proj.GetValue(config.Args[0]); ok {
			fmt.Println(value)
		}
	}

	if config.Operation == projector.Add {
		proj.SetValue(config.Args[0], config.Args[1])
    proj.Save()
	}

	if config.Operation == projector.Remove {
		proj.SetValue(config.Args[0], config.Args[1])
    proj.Save()
	}
}
