// Conta e nuvem (opcional).
// Com os dois campos vazios, a ficha funciona como antes: tudo fica salvo só neste aparelho.
// Para ligar, crie um projeto no Supabase e copie de Project Settings → API:
//   url:     Project URL (ex.: https://abcdefghijkl.supabase.co)
//   anonKey: chave "anon" / "publishable". É pública: a proteção dos dados vem das regras do banco (supabase/schema.sql).
// Nunca coloque aqui a chave "service_role" nem a chave da API da Anthropic.
window.FICHA_CLOUD = {
  url: "",
  anonKey: ""
};
