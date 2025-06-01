import React, { useState } from "react";
import { Card, CardContent } from "./components/ui/card";
import { Button } from "./components/ui/button";
import { Input } from "./components/ui/input";
import { Textarea } from "./components/ui/textarea";
import { LoaderCircle, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

const openaiApiKey = "OPENAI_KEY_AQUI";

const steps = [
  {
    title: "Perfil de Cliente Ideal (ICP)",
    fields: [
      { label: "Segmento/Indústria", name: "industry" },
      { label: "Tamanho da Empresa", name: "company_size" },
      { label: "Principais Dores/Objetivos", name: "pain_points", textarea: true },
      { label: "Produtos/Serviços Oferecidos", name: "offer" },
      { label: "Região/Idioma", name: "locale" },
    ],
    prompt: ({ values }) => `
Objetivo: Criar um resumo claro do ICP.
1. Use os dados abaixo para descrever a persona decisora (cargo, metas, desafios).
2. Traga 3 insights de contexto de mercado que influenciem essa persona em 2025.
3. Liste 5 argumentos de valor que a ${values.offer} resolve.
4. Mantenha o texto em português, tom profissional acessível.
Dados:
• Indústria: ${values.industry}
• Tamanho da empresa: ${values.company_size}
• Dores: ${values.pain_points}
• Região/Idioma: ${values.locale}
`,
  },
  {
    title: "Temas do Target",
    fields: [
      { label: "Tópicos Macro de Interesse", name: "known_topics", textarea: true },
      { label: "Eventos/Sazonalidades (próximos 90 dias)", name: "upcoming_events" },
      { label: "Palavras-chave Prioritárias", name: "priority_keywords" },
    ],
    prompt: ({ values, prev }) => `
Gere uma lista de 10 temas de conteúdo altamente relevantes para o ICP descrito abaixo, ponderando tendências atuais do setor, palavras-chave e eventos futuros. Para cada tema, inclua:
• Título (até 70 caracteres)
• Ângulo/Dor que resolve
• Palavra-chave primária
• Formato indicado (blog, vídeo, carrossel etc.)
Referências:
ICP: ${prev}
Temas já mapeados: ${values.known_topics}
Eventos/Sazonalidade: ${values.upcoming_events}
Palavras-chave prioridade: ${values.priority_keywords}
`,
  },
  {
    title: "Pesquisa Profunda",
    fields: [
      { label: "Selecione 1–3 temas (digite)", name: "selected_theme" },
      { label: "Tipo de Fonte Prioritária (ex: cases, dados, estatísticas)", name: "source_pref" },
    ],
    prompt: ({ values }) => `
Faça uma análise aprofundada sobre "${values.selected_theme}".
1. Resuma os 5 dados ou estatísticas mais recentes (cite fonte e ano).
2. Traga 2 casos práticos (breve narrativa em 3 linhas cada).
3. Aponte oportunidades ou lacunas que PMEs no Brasil podem explorar.
4. Formate em bullets, português claro, com referências entre parênteses.
`,
  },
  {
    title: "Post Pilar para Blog",
    fields: [
      { label: "Tema Selecionado", name: "pillar_topic" },
      { label: "Palavra-chave Foco (long-tail)", name: "pillar_keyword" },
      { label: "Call to Action desejado", name: "pillar_cta" },
    ],
    prompt: ({ values }) => `
Tarefa: Escreva um post pilar de 1800–2200 palavras otimizado para Yoast SEO.
Estrutura: H1, introdução curta (70–90 palavras), H2+H3 em escaneabilidade, FAQ (Schema), conclusão com CTA.
Regras Yoast: transição, voz ativa > 75 %, frases ≤ 20 palavras, Flesch ≥ 60.
Palavra-chave foco: ${values.pillar_keyword}
Tema: ${values.pillar_topic}
CTA: ${values.pillar_cta}
Use tom profissional-empático, exemplos de PMEs brasileiras.
`,
  },
  {
    title: "Pauta de Redes Sociais",
    fields: [
      { label: "Posts por Semana", name: "posts_per_week" },
      { label: "Formatos disponíveis (imagem, carrossel, reels...)", name: "formats" },
      { label: "Objetivos de cada post (ex: 50% educar, 30% engajar, 20% vender)", name: "mix" },
      { label: "Temas aprovados (cole/edite da etapa anterior)", name: "approved_themes", textarea: true },
    ],
    prompt: ({ values }) => `
Crie um calendário de conteúdo para ${values.posts_per_week} posts/semana durante 4 semanas, usando os temas aprovados: ${values.approved_themes}.
Para cada post, gere:
• Data sugerida (considerando dias de maior engajamento B2B)
• Formato entre ${values.formats}
• Headline (≤ 50 caracteres)
• Texto de legenda (≤ 150 palavras) com 3 hashtags estratégicas
• Instrução de imagem/vídeo para IA generativa (Stable Diffusion) em português, 16:9
• CTA alinhada ao mix ${values.mix} (Educar/Engajar/Vender)
Entregue em tabela Markdown.
`,
  },
  {
    title: "Assets de Texto e Imagem",
    fields: [
      { label: "Headline do Post", name: "post_headline" },
      { label: "Setor da Persona", name: "industry" },
      { label: "Elementos Visuais desejados", name: "visual_elements" },
      { label: "Formato (ex: 16:9, 1:1)", name: "aspect_ratio" },
    ],
    prompt: ({ values }) => `
Gere a copy final da postagem "${values.post_headline}", seguindo este briefing:
• Persona: decisor PME no(s) setor(es) ${values.industry}
• Tom: profissional, acessível, uso moderado de emojis
• Limite: 120 palavras
Depois, crie um prompt para Stable Diffusion (português) que produza uma imagem 4K realista no formato ${values.aspect_ratio}, com elementos: ${values.visual_elements}. Não mencione "Stable Diffusion" no prompt.
`,
  },
];

async function fetchOpenAI(prompt) {
  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${openaiApiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "gpt-4o",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
    }),
  });
  const data = await res.json();
  return data.choices?.[0]?.message?.content ?? "Nenhuma resposta.";
}

export default function ContentWorkflowApp() {
  const [step, setStep] = useState(0);
  const [values, setValues] = useState({});
  const [loading, setLoading] = useState(false);
  const [outputs, setOutputs] = useState({});
  const [error, setError] = useState(null);

  const current = steps[step];

  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const prevOutput = step === 0 ? null : outputs[step - 1];
      const prompt = current.prompt({ values, prev: prevOutput });
      const response = await fetchOpenAI(prompt);

      setOutputs({ ...outputs, [step]: response });
      setStep(step + 1);
      setValues({});
    } catch (err) {
      setError("Erro ao conectar com a API da OpenAI.");
    }
    setLoading(false);
  }

  function handleBack() {
    if (step > 0) setStep(step - 1);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-zinc-100 flex flex-col items-center p-6">
      <motion.div
        className="w-full max-w-2xl"
        initial={{ opacity: 0, y: 32 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Card className="rounded-2xl shadow-lg p-6">
          <h2 className="text-2xl font-bold mb-4">{current?.title}</h2>
          {step > 0 && (
            <div className="mb-4 text-sm text-zinc-500">
              <span className="font-medium text-zinc-700">Etapa anterior:</span>
              <pre className="whitespace-pre-wrap bg-zinc-100 rounded p-2 mt-1 max-h-32 overflow-auto text-xs">{outputs[step - 1]}</pre>
            </div>
          )}
          {step < steps.length ? (
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                {current.fields.map((f) =>
                  f.textarea ? (
                    <Textarea
                      key={f.name}
                      name={f.name}
                      required
                      value={values[f.name] || ""}
                      onChange={handleChange}
                      placeholder={f.label}
                      className="resize-none"
                    />
                  ) : (
                    <Input
                      key={f.name}
                      name={f.name}
                      required
                      value={values[f.name] || ""}
                      onChange={handleChange}
                      placeholder={f.label}
                    />
                  )
                )}
              </div>
              <div className="flex justify-between mt-6">
                <Button type="button" onClick={handleBack} variant="outline" disabled={step === 0 || loading}>
                  Voltar
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading ? <LoaderCircle className="animate-spin mr-2" /> : <ArrowRight className="mr-2" />}
                  Gerar Conteúdo
                </Button>
              </div>
              {error && <div className="text-red-500 mt-2">{error}</div>}
            </form>
          ) : (
            <div>
              <h3 className="text-xl font-semibold mb-2">Workflow concluído!</h3>
              <div className="space-y-4">
                {Object.entries(outputs).map(([k, v]) => (
                  <div key={k}>
                    <strong className="block mb-1">{steps[k]?.title}:</strong>
                    <CardContent className="bg-zinc-50 border rounded p-2 whitespace-pre-wrap text-xs">{v}</CardContent>
                  </div>
                ))}
              </div>
              <Button className="mt-6" onClick={() => { setStep(0); setOutputs({}); }}>Recomeçar</Button>
            </div>
          )}
        </Card>
      </motion.div>
    </div>
  );
}
