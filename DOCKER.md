# Guia de Comandos Docker

## Comandos Básicos

### `docker compose up`
Sobe os containers do projeto (banco de dados + servidor). Use no dia a dia para iniciar o ambiente de desenvolvimento.

---

### `docker compose up --build`
Sobe os containers **reconstruindo a imagem** do servidor antes de subir. Use sempre que houver alterações no `Dockerfile` ou nas dependências do projeto (`package.json`, `pnpm-lock.yaml`).

---

### `docker compose up -d`
Sobe os containers em **modo detached** (em segundo plano), liberando o terminal. Use quando não precisar acompanhar os logs em tempo real.

---

### `docker compose up -d --build`
Combina os dois anteriores: reconstrói a imagem e sobe em segundo plano.

---

### `docker compose down`
Para e remove os containers. Use ao encerrar o trabalho ou antes de subir novamente com `--build`.

> Os volumes (banco de dados) são preservados — seus dados não são perdidos.

---

### `docker compose down -v`
Para e remove os containers **junto com os volumes**. Use quando o ambiente estiver corrompido, com erros de permissão ou quando quiser um ambiente completamente limpo.

> ⚠️ Isso apaga todos os dados do banco. Após rodar, será necessário rodar as migrations novamente com `pnpm migration`.



<br/>


## Logs e Monitoramento

### `docker compose logs`
Exibe todos os logs dos containers. Útil para investigar erros após subir em modo detached (`-d`).

---

### `docker compose logs -f`
Exibe os logs em tempo real (equivalente ao terminal preso no `docker compose up`). Use para monitorar o servidor enquanto testa as rotas.



<br/>


## Limpeza Geral

### `docker stop $(docker ps -a -q)`
Para **todos** os containers em execução na máquina, não apenas os do projeto. Use quando houver conflito de portas ou múltiplos containers rodando simultaneamente.

---

### `docker rm $(docker ps -a -q)`
Remove **todos** os containers parados da máquina. Use em conjunto com o comando acima para uma limpeza completa.

---

### `sudo systemctl restart docker`
Reinicia o serviço do Docker no sistema. Use quando o Docker travar, não responder ou apresentar comportamento inesperado.


<br/>


## Fluxo Recomendado

**Início do dia:**
```bash
docker compose up
```

**Após alterar Dockerfile ou dependências:**
```bash
docker compose down
docker compose up --build
```

**Ambiente corrompido ou erro de permissão:**
```bash
docker compose down -v
docker compose up --build
```

**Docker travado:**
```bash
sudo systemctl restart docker
docker compose up --build
```