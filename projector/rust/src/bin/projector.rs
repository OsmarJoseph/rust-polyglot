use anyhow::Result;
use clap::Parser;
use rust::{
    config::{Config, Operation},
    opts::Opts,
    projector::Projector,
};

fn main() -> Result<()> {
    let config: Config = Opts::parse().try_into()?;

    let mut projector = Projector::from_config(config.config_path, config.pwd);

    match config.operation {
        Operation::Print(None) => {
            let value = projector.get_value_all();
            let value = serde_json::to_string(&value)?;
            println!("{}", value);
            Ok(())
        }
        Operation::Print(Some(key)) => {
            projector.get_value(&key).map(|value| println!("{}", value));
            Ok(())
        }
        Operation::Add(key, value) => {
            projector.set_value(key, value);
            projector.save()?;
            Ok(())
        }
        Operation::Remove(key) => {
            projector.remove_value(&key);
            projector.save()?;
            Ok(())
        }
    }
}
