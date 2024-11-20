package projector

import (
	"encoding/json"
	"os"
	"path"
)

type Data struct {
	Projector map[string]map[string]string `json:"projector"`
}

type Projector struct {
	config Config
	data   Data
}

func CreateProjector(config *Config, data *Data) *Projector {
	return &Projector{
		config: *config,
		data:   *data,
	}
}

func (p *Projector) GetValueAll() map[string]string {
	current := p.config.Pwd
	previous := ""

	out := map[string]string{}

	paths := []string{}

	for current != previous {
		paths = append(paths, current)

		previous = current
		current = path.Dir(current)
	}

	for i := len(paths) - 1; i >= 0; i-- {
		if dir, ok := p.data.Projector[paths[i]]; ok {
			for key, value := range dir {
				out[key] = value
			}
		}
	}

	return out
}
func (p *Projector) GetValue(key string) (string, bool) {
	current := p.config.Pwd
	previous := ""

	out := ""
	found := false

	for current != previous {

		if dir, ok := p.data.Projector[current]; ok {
			if value, ok := dir[key]; ok {
				out = value
				found = true
				break
			}
		}

		previous = current
		current = path.Dir(current)

	}

	return out, found
}

func (p *Projector) SetValue(key, value string) {
	if _, ok := p.data.Projector[p.config.Pwd]; !ok {
		p.data.Projector[p.config.Pwd] = map[string]string{}
	}

	p.data.Projector[p.config.Pwd][key] = value
}

func (p *Projector) RemoveValue(key string) {
	if dir, ok := p.data.Projector[p.config.Pwd]; ok {
		delete(dir, key)
	}
}

func defaultProjector(config *Config) *Projector {
	return &Projector{
		config: *config,
		data:   Data{Projector: map[string]map[string]string{}},
	}
}

func NewProjector(config *Config) *Projector {
	if _, err := os.Stat(config.Config); err != nil {
		contents, err := os.ReadFile(config.Config)

		if err != nil {
			return defaultProjector(config)
		}

		var data Data

		err = json.Unmarshal(contents, &data)

		if err != nil {
			return defaultProjector(config)
		}

		return &Projector{
			config: *config,
			data:   data,
		}
	}

	return defaultProjector(config)
}
