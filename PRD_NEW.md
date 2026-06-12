# 📋 PRD - PRODUCT REQUIREMENTS DOCUMENT

**SENAI EXCHANGE** | v1.0 | 2026-06-12

Plataforma web para trocas entre alunos da instituição. Permite publicar, buscar e negociar itens de forma segura e colaborativa.

---

## 🔍 PROBLEMA & OPORTUNIDADE

**Problema:**
- Alto custo de materiais para alunos
- Desperdício de recursos após disciplinas
- Falta de forma segura de trocar itens
- Isolamento entre alunos

**Oportunidade:**
- ~500-1000 alunos da SENAI
- Economia de R$ 500-2000 por aluno/ano
- Sustentabilidade + Comunidade

**Por que agora:** Tecnologia acessível + demanda pós-COVID

---

## 📊 OBJETIVOS

| Objetivo | Meta | KPI |
|---|---|---|
| **Adoção** | 50% dos alunos em 6 meses | Usuários ativos |
| **Engajamento** | 200+ trocas no semestre | Taxa de conclusão |
| **Satisfação** | 4.5/5 rating | NPS |
| **Sustentabilidade** | 10 toneladas reutilizadas | Economia (R$) |

---

## 👥 PERSONAS (4 tipos)

| Persona | Perfil | Motivação | Freq. |
|---|---|---|---|
| **João (Econômico)** | 18-25, Dev | Economizar | 3-5x/semana |
| **Marina (Sustentável)** | 20-30, Eletr. | Sustentabilidade | 1-2x/semana |
| **Alex (Rápido)** | 18-22, Mec. | Velocidade | 5-7x/semana |
| **Prof. Carla (Admin)** | 40-55, Coord. | Gestão | 2-3x/mês |

---

## ⚙️ FUNCIONALIDADES MVP

| Feature | Status | Descrição |
|---|---|---|
| **Autenticação** | ✅ | Login/Cadastro seguro |
| **Publicar Anúncio** | ✅ | Nome, descrição, categoria, fotos |
| **Explorar Catálogo** | ✅ | Filtrar por categoria |
| **Sistema de Trocas** | ✅ | Solicitar, aceitar, recusar, finalizar |
| **Chat** | ✅ | Mensagens entre alunos |
| **Perfil** | ✅ | Dados e estatísticas |
| **Busca** | ⏳ | v1.1 |
| **Ratings** | ⏳ | v1.1 |

---

## 🔄 FLUXOS PRINCIPAIS

**Fluxo 1: Nova Troca**
```
Explorar → Encontrar Item → Solicitar Troca → Chat → Negociar 
→ Aceitar → Encontro → Finalizar
Tempo: 48-72 horas
```

**Fluxo 2: Responder Proposta**
```
Notificação → Ver Proposta → Chat → ACEITAR/RECUSAR
Tempo: 2-24 horas
```

**Fluxo 3: Publicar Anúncio**
```
"Novo Anúncio" → Form → Fotos → Preview → Publicar
Tempo: 5-10 minutos
```

---

## 🎨 DESIGN

**Cores:** Azul SENAI (#0056B3), Ciano (#17A2B8), Verde (#28A745)
**Responsivo:** Mobile <576px | Tablet 576-992px | Desktop >992px
**Tipografia:** Roboto Bold (headings), Roboto Regular (body)

---

## 🗓️ ROADMAP

| Período | Status | Metas |
|---|---|---|
| **Q1 2026** | ✅ DONE | 50+ usuários, 20+ trocas |
| **Q2 2026** | 🔄 IN PROGRESS | Busca, ratings, notificações |
| **Q3 2026** | ⏳ PLANNED | Sistema de pontos, favoritos |
| **Q4 2026** | 🔮 VISION | Chat real-time, admin dashboard |
| **2027** | 🔮 VISION | Mobile app, expansão, IA |

---

## ✅ CRITÉRIOS DE ACEITAÇÃO

**Login:**
- Email/senha corretos → redirecionado para catálogo
- Email/senha incorretos → mensagem de erro

**Publicar Anúncio:**
- Nome obrigatório (max 200 chars)
- Descrição opcional (max 500 chars)
- Fotos: até 3, max 5MB cada
- Apenas dono pode editar/deletar

**Solicitar Troca:**
- Solicitante ≠ Receptor
- Cria troca com status PENDENTE
- Ambos podem trocar mensagens
- Status: PENDENTE → ACEITA/RECUSADA → FINALIZADA

---

## 🚫 RESTRIÇÕES

| Tipo | Detalhe |
|---|---|
| **Escopo** | Apenas alunos SENAI |
| **Conteúdo** | Itens legais apenas |
| **Segurança** | Sem dados de pagamento, senhas BCrypt |
| **Performance** | < 2s para carregamento, < 500ms API |
| **Navegadores** | Chrome 90+, Firefox 88+, Safari 14+, Edge 90+ |
| **Dados** | Imagens max 5MB, backup semanal |

**Limitações v1.0:** Sem real-time, sem foto perfil, sem ratings, sem busca avançada

---

**GitHub:** https://github.com/Nicolas75460/sistema-trocas-alunos  
**Última atualização:** 2026-06-12
