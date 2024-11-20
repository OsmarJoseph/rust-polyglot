use std::{
    collections::HashMap,
    path::{Path, PathBuf},
};

use serde::{Deserialize, Serialize};

use crate::config::Config;

#[derive(Debug, Serialize, Deserialize)]

struct Data {
    pub projector: HashMap<PathBuf, HashMap<String, String>>,
}

pub struct Projector {
    config: Config,
    data: Data,
}

fn default_data() -> Data {
    Data {
        projector: HashMap::new(),
    }
}

impl Projector {
    pub fn get_value_all(&self) -> HashMap<&String, &String> {
        let mut current = Some(self.config.pwd.as_path());
        let mut paths: Vec<&Path> = vec![];

        while let Some(parent) = current {
            paths.push(parent);
            current = parent.parent();
        }

        let mut out = HashMap::new();

        for path in paths.into_iter().rev() {
            if let Some(data) = self.data.projector.get(path) {
                out.extend(data.iter());
            }
        }

        return out;
    }
    pub fn set_value(&mut self, key: String, value: String) {
        self.data.projector.get_mut(&self.config.pwd).map(|x| {
            x.insert(key, value);
        });
    }

    pub fn remove_value(&mut self, key: &str) {
        self.data.projector.get_mut(&self.config.pwd).map(|x| {
            x.remove(key);
        });
    }
    pub fn get_value(&self, key: &str) -> Option<&String> {
        let mut current = Some(self.config.pwd.as_path());

        let mut out = None;

        while let Some(parent) = current {
            if let Some(data) = self.data.projector.get(parent) {
                if let Some(value) = data.get(key) {
                    out = Some(value);
                    break;
                }
            }
            current = parent.parent();
        }

        return out;
    }

    pub fn from_config(config: Config) -> Self {
        if std::fs::exists(&config.config_path).is_ok() {
            let contents = std::fs::read_to_string(&config.config_path)
                .unwrap_or("{ \"projector\": {} }".to_string());

            let data = serde_json::from_str(&contents).unwrap_or(default_data());

            return Projector { config, data };
        }

        return Projector {
            config,
            data: default_data(),
        };
    }
}

#[cfg(test)]
mod test {
    use std::{collections::HashMap, path::PathBuf};

    use collection_macros::hashmap;

    use crate::config::{Config, Operation};

    use super::{Data, Projector};

    fn create_data() -> HashMap<PathBuf, HashMap<String, String>> {
        hashmap! {
            PathBuf::from("/") => hashmap! {
                "foo".into() => "bar1".into(),
                "fem".into() => "is".into(),
            },
            PathBuf::from("/foo") => hashmap! {
                "foo".into() => "bar2".into(),
            },
            PathBuf::from("/foo/bar") => hashmap! {
                "foo".into() => "bar3".into(),
            },
        }
    }

    fn get_projector(pwd: PathBuf) -> Projector {
        return Projector {
            config: Config {
                pwd,
                config_path: PathBuf::from(""),
                operation: Operation::Print(None),
            },
            data: Data {
                projector: create_data(),
            },
        };
    }

    #[test]
    fn get_value() {
        let projector = get_projector(PathBuf::from("/foo/bar"));

        assert_eq!(projector.get_value("foo"), Some(&"bar3".into()));
        assert_eq!(projector.get_value("fem"), Some(&"is".into()));
    }

    #[test]
    fn set_value() {
        let mut projector = get_projector(PathBuf::from("/foo/bar"));

        assert_eq!(projector.get_value("foo"), Some(&"bar3".into()));
        projector.set_value("foo".into(), "bar4".into());
        assert_eq!(projector.get_value("foo"), Some(&"bar4".into()));
        projector.set_value("fem".into(), "is_2".into());
        assert_eq!(projector.get_value("fem"), Some(&"is_2".into()));
    }

    #[test]
    fn remove_value() {
        let mut projector = get_projector(PathBuf::from("/foo/bar"));

        projector.remove_value("foo");
        projector.remove_value("fem");

        assert_eq!(projector.get_value("foo"), Some(&"bar2".into()));
        assert_eq!(projector.get_value("fem"), Some(&"is".into()));
    }
}
