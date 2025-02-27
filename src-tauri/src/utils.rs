use blake3;
use serde_json::Value;

#[tauri::command(async)]
#[specta::specta]
pub fn blake_hash(data: Value) -> String {
    let bytes = match data {
        Value::String(s) => s.into_bytes(),
        Value::Number(n) => n.to_string().into_bytes(),
        Value::Array(arr) => arr
            .iter()
            .filter_map(|v| v.as_u64())
            .flat_map(|n| n.to_le_bytes())
            .collect(),
        Value::Object(_) => serde_json::to_string(&data)
            .unwrap_or_default()
            .into_bytes(),
        Value::Bool(b) => vec![b as u8],
        Value::Null => vec![],
    };

    format!("{}", blake3::hash(&bytes))
}
