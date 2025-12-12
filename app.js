// ================== ESTADO SIMPLES (NAVEGADOR) ==================

let currentWorker = null;
let currentLawyer = null;
let lawyerCredits = 0;

// "Leads" de exemplo para advogados (simulados no front)
const exampleLeads = [
  {
    id: 1,
    workerName: "Auxiliar de limpeza – SP",
    summary:
      "Trabalha há 2 anos sem receber horas extras corretamente, faz dobra de turno e não recebe adicional.",
    phone: "(11) 9 8888-0001",
    email: "trabalhador1@exemplo.com",
  },
  {
    id: 2,
    workerName: "Operador de máquina – Indústria",
    summary:
      "Foi dispensado sem justa causa, não recebeu férias proporcionais nem multa de 40% do FGTS.",
    phone: "(11) 9 7777-0002",
    email: "trabalhador2@exemplo.com",
  },
  {
    id: 3,
    workerName: "Atendente de loja – Shopping",
    summary:
      "Relata assédio moral diário, metas abusivas e jornada sem intervalo adequado.",
    phone: "(11) 9 6666-0003",
    email: "trabalhador3@exemplo.com",
  },
];

// Histórico simples de dúvidas do trabalhador (só na memória)
let workerQuestions = [];

// ================== NAVEGAÇÃO ENTRE SEÇÕES ==================

function showSection(sectionId) {
  const sections = document.querySelectorAll(".section");
  sections.forEach((sec) => {
    if (sec.id === sectionId) {
      sec.classList.add("visible");
    } else {
      sec.classList.remove("visible");
    }
  });

  const navLinks = document.querySelectorAll(".nav-link");
  navLinks.forEach((btn) => {
    if (btn.dataset.target === sectionId) {
      btn.classList.add("active");
    } else {
      btn.classList.remove("active");
    }
  });

  window.scrollTo({ top: 0, behavior: "smooth" });
}

// ================== WORKER – CADASTRO E DÚVIDAS ==================

function handleWorkerRegister(event) {
  event.preventDefault();

  const name = document.getElementById("worker-name").value.trim();
  const email = document.getElementById("worker-email").value.trim();
  const phone = document.getElementById("worker-phone").value.trim();

  if (!name || !email || !phone) {
    alert("Preencha todos os campos.");
    return;
  }

  currentWorker = { name, email, phone };
  workerQuestions = []; // zera histórico local

  document.getElementById("worker-register-form").reset();
  document.getElementById("worker-area").classList.remove("hidden");

  alert(
    "Conta do trabalhador criada (modo demonstração). Agora você pode registrar suas dúvidas."
  );

  renderWorkerQuestions();
}

function handleWorkerQuestion(event) {
  event.preventDefault();
  if (!currentWorker) {
    alert("Crie sua conta de trabalhador primeiro.");
    return;
  }

  const text = document.getElementById("worker-question").value.trim();
  if (!text) {
    alert("Descreva o problema trabalhista.");
    return;
  }

  const question = {
    id: workerQuestions.length + 1,
    text,
    createdAt: new Date().toLocaleString("pt-BR"),
  };
  workerQuestions.unshift(question);

  document.getElementById("worker-question-form").reset();
  renderWorkerQuestions();
  alert("Sua dúvida foi registrada (modo demonstração).");
}

function renderWorkerQuestions() {
  const list = document.getElementById("worker-questions-list");
  if (!workerQuestions.length) {
    list.classList.add("empty-state");
    list.textContent = "Você ainda não enviou nenhuma dúvida.";
    return;
  }

  list.classList.remove("empty-state");
  list.innerHTML = "";

  workerQuestions.forEach((q) => {
    const div = document.createElement("div");
    div.className = "question-item";
    div.innerHTML = `
      <div class="question-header">
        <div class="question-meta">Enviada em ${q.createdAt}</div>
      </div>
      <div class="question-body">${q.text}</div>
      <div class="question-contacts">
        <em>No ambiente real, a resposta do advogado apareceria aqui.</em>
      </div>
    `;
    list.appendChild(div);
  });
}

// ================== LAWYER – CADASTRO E LEADS ==================

function handleLawyerRegister(event) {
  event.preventDefault();

  const name = document.getElementById("lawyer-name").value.trim();
  const email = document.getElementById("lawyer-email").value.trim();
  const phone = document.getElementById("lawyer-phone").value.trim();
  const oab = document.getElementById("lawyer-oab").value.trim();

  if (!name || !email || !phone || !oab) {
    alert("Preencha todos os campos.");
    return;
  }

  currentLawyer = { name, email, phone, oab };
  lawyerCredits = 5; // créditos iniciais (simulação)

  document.getElementById("lawyer-register-form").reset();
  document.getElementById("lawyer-area").classList.remove("hidden");

  updateLawyerCredits();
  renderLawyerLeads();

  alert(
    "Perfil de advogado criado (modo demonstração). Você recebeu 5 oportunidades iniciais."
  );
}

function updateLawyerCredits() {
  const el = document.getElementById("lawyer-credits");
  if (el) el.textContent = lawyerCredits;
}

function renderLawyerLeads() {
  const container = document.getElementById("lawyer-leads");
  container.innerHTML = "";

  exampleLeads.forEach((lead) => {
    const item = document.createElement("div");
    item.className = "question-item";

    item.innerHTML = `
      <div class="question-header">
        <div class="question-meta">
          ${lead.workerName}
        </div>
        <button class="btn btn-outline btn-small" data-lead-id="${lead.id}">
          Ativar oportunidade (1 crédito)
        </button>
      </div>
      <div class="question-body">${lead.summary}</div>
      <div class="question-contacts">
        <div><strong>WhatsApp:</strong> <span class="blurred" data-type="phone">${lead.phone}</span></div>
        <div><strong>E-mail:</strong> <span class="blurred" data-type="email">${lead.email}</span></div>
      </div>
    `;

    container.appendChild(item);
  });

  container.querySelectorAll("button[data-lead-id]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const leadId = Number(btn.getAttribute("data-lead-id"));
      activateLead(leadId, btn);
    });
  });
}

function activateLead(leadId, button) {
  if (!currentLawyer) {
    alert("Crie seu perfil de advogado primeiro.");
    return;
  }
  if (lawyerCredits <= 0) {
    alert(
      "Você não tem créditos suficientes. Use a área de compra de oportunidades."
    );
    return;
  }

  lawyerCredits -= 1;
  updateLawyerCredits();

  const item = button.closest(".question-item");
  if (!item) return;

  item.querySelectorAll(".blurred").forEach((el) => el.classList.remove("blurred"));
  button.disabled = true;
  button.textContent = "Contato liberado";

  alert(
    "Oportunidade ativada! Agora você tem acesso ao WhatsApp e e-mail do trabalhador."
  );
}

function handleBuyCredits(qty) {
  if (!currentLawyer) {
    alert("Crie seu perfil de advogado primeiro.");
    return;
  }

  let price = 0;
  if (qty === 5) price = 90;
  if (qty === 10) price = 120;
  if (qty === 20) price = 140;

  alert(
    `Simulação de compra:\n\n` +
      `Pacote: ${qty} oportunidades\nValor: R$ ${price.toFixed(
        2
      )}\n\nPara operar de verdade, você integrará o PIX ao seu banco/gateway.\nNo protótipo, os créditos serão adicionados automaticamente.`
  );

  lawyerCredits += qty;
  updateLawyerCredits();
}

// ================== CALCULADORAS ==================

function handleCalcRescisao(event) {
  event.preventDefault();

  const salario = Number(document.getElementById("res-salario").value);
  const meses = Number(document.getElementById("res-meses").value);
  const tipo = document.getElementById("res-tipo").value;
  const resultEl = document.getElementById("rescisao-result");

  if (!salario || !meses) {
    resultEl.textContent = "Informe salário e tempo de casa.";
    return;
  }

  const mesesPropor = Math.min(meses, 12);
  const feriasPropor = (salario * mesesPropor) / 12;
  const tercoFerias = feriasPropor / 3;
  const decimoPropor = (salario * mesesPropor) / 12;

  let avisoPrevio = 0;
  let multaFgts = 0;

  if (tipo === "sem-justa") {
    avisoPrevio = salario;
    multaFgts = salario * (meses / 12) * 0.4 * 0.08;
  }

  const total =
    feriasPropor + tercoFerias + decimoPropor + avisoPrevio + multaFgts;

  resultEl.innerHTML = `
    <strong>Estimativa resumida (aproximada):</strong><br/>
    Férias proporcionais: R$ ${feriasPropor.toFixed(2)}<br/>
    1/3 de férias: R$ ${tercoFerias.toFixed(2)}<br/>
    13º proporcional: R$ ${decimoPropor.toFixed(2)}<br/>
    Aviso prévio (se houver): R$ ${avisoPrevio.toFixed(2)}<br/>
    Multa FGTS (estimativa): R$ ${multaFgts.toFixed(2)}<br/>
    <br/>
    <strong>Total aproximado: R$ ${total.toFixed(2)}</strong><br/>
    <span class="muted small">
      Esses valores são apenas estimativos. Use para ter uma noção inicial e
      depois refine em cálculo completo.
    </span>
  `;
}

function handleCalcHoras(event) {
  event.preventDefault();

  const salario = Number(document.getElementById("horas-salario").value);
  const horas = Number(document.getElementById("horas-qtd").value);
  const adicionalPerc = Number(
    document.getElementById("horas-adic").value || 0
  );
  const resultEl = document.getElementById("horas-result");

  if (!salario || !horas) {
    resultEl.textContent = "Informe salário e horas extras.";
    return;
  }

  const horasMensaisPadrao = 220;
  const valorHora = salario / horasMensaisPadrao;
  const fatorAdicional = 1 + adicionalPerc / 100;
  const valorExtras = valorHora * horas * fatorAdicional;

  resultEl.innerHTML = `
    <strong>Estimativa de valor de horas extras no mês:</strong><br/>
    Valor da hora normal (aprox.): R$ ${valorHora.toFixed(2)}<br/>
    Adicional aplicado: ${adicionalPerc.toFixed(0)}%<br/>
    <br/>
    <strong>Total aproximado de horas extras: R$ ${valorExtras.toFixed(
      2
    )}</strong><br/>
    <span class="muted small">
      Cálculo simplificado, útil para ter uma noção inicial para negociação
      e análise de viabilidade.
    </span>
  `;
}

function handleCalcAdicional(event) {
  event.preventDefault();

  const base = Number(document.getElementById("adic-base").value);
  const perc = Number(document.getElementById("adic-perc").value);
  const resultEl = document.getElementById("adic-result");

  if (!base || !perc) {
    resultEl.textContent = "Informe base e percentual.";
    return;
  }

  const adicional = (base * perc) / 100;

  resultEl.innerHTML = `
    <strong>Valor mensal do adicional:</strong><br/>
    Base: R$ ${base.toFixed(2)}<br/>
    Percentual: ${perc.toFixed(0)}%<br/>
    <br/>
    <strong>Adicional estimado: R$ ${adicional.toFixed(2)}</strong><br/>
    <span class="muted small">
      Pode ser usado para simular insalubridade, periculosidade
      ou outros adicionais calculados sobre uma base.
    </span>
  `;
}

// ================== INICIALIZAÇÃO ==================

window.addEventListener("DOMContentLoaded", () => {
  // Navegação pelos botões data-target
  document.querySelectorAll("[data-target]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const target = btn.getAttribute("data-target");
      if (target) {
        showSection(target);
      }
    });
  });

  // Worker
  const workerForm = document.getElementById("worker-register-form");
  if (workerForm) workerForm.addEventListener("submit", handleWorkerRegister);

  const workerQuestionForm = document.getElementById("worker-question-form");
  if (workerQuestionForm)
    workerQuestionForm.addEventListener("submit", handleWorkerQuestion);

  // Lawyer
  const lawyerForm = document.getElementById("lawyer-register-form");
  if (lawyerForm) lawyerForm.addEventListener("submit", handleLawyerRegister);

  document.querySelectorAll("button[data-buy]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const qty = Number(btn.getAttribute("data-buy"));
      if (qty) handleBuyCredits(qty);
    });
  });

  // Calculadoras
  const resForm = document.getElementById("calc-rescisao-form");
  if (resForm) resForm.addEventListener("submit", handleCalcRescisao);

  const horasForm = document.getElementById("calc-horas-form");
  if (horasForm) horasForm.addEventListener("submit", handleCalcHoras);

  const adicForm = document.getElementById("calc-adic-form");
  if (adicForm) adicForm.addEventListener("submit", handleCalcAdicional);

  // Começa na home
  showSection("section-home");
});
