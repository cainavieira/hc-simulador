export type Equipe = {
  id: number
  pais: string
  codigo: string
}

export const timesMock: Equipe[] = [
  // Anfitriões
  { id: 1, pais: "Estados Unidos", codigo: "US" },
  { id: 2, pais: "Canadá", codigo: "CA" },
  { id: 3, pais: "México", codigo: "MX" },

  // CONMEBOL
  { id: 4, pais: "Argentina", codigo: "AR" },
  { id: 5, pais: "Brasil", codigo: "BR" },
  { id: 6, pais: "Colômbia", codigo: "CO" },
  { id: 7, pais: "Equador", codigo: "EC" },
  { id: 8, pais: "Uruguai", codigo: "UY" },
  { id: 9, pais: "Venezuela", codigo: "VE" },

  // UEFA
  { id: 10, pais: "Alemanha", codigo: "DE" },
  { id: 11, pais: "Espanha", codigo: "ES" },
  { id: 12, pais: "França", codigo: "FR" },
  { id: 13, pais: "Portugal", codigo: "PT" },
  { id: 14, pais: "Inglaterra", codigo: "GB" },
  { id: 15, pais: "Holanda", codigo: "NL" },
  { id: 16, pais: "Croácia", codigo: "HR" },
  { id: 17, pais: "Suíça", codigo: "CH" },
  { id: 18, pais: "Áustria", codigo: "AT" },
  { id: 19, pais: "Dinamarca", codigo: "DK" },
  { id: 20, pais: "Sérvia", codigo: "RS" },
  { id: 21, pais: "Bélgica", codigo: "BE" },
  { id: 22, pais: "Hungria", codigo: "HU" },
  { id: 23, pais: "Turquia", codigo: "TR" },
  { id: 24, pais: "Romênia", codigo: "RO" },
  { id: 25, pais: "Eslováquia", codigo: "SK" },

  // CAF
  { id: 26, pais: "Marrocos", codigo: "MA" },
  { id: 27, pais: "Senegal", codigo: "SN" },
  { id: 28, pais: "Egito", codigo: "EG" },
  { id: 29, pais: "Nigéria", codigo: "NG" },
  { id: 30, pais: "Costa do Marfim", codigo: "CI" },
  { id: 31, pais: "RD Congo", codigo: "CD" },
  { id: 32, pais: "Camarões", codigo: "CM" },
  { id: 33, pais: "África do Sul", codigo: "ZA" },
  { id: 34, pais: "Mali", codigo: "ML" },

  // AFC
  { id: 35, pais: "Japão", codigo: "JP" },
  { id: 36, pais: "Coreia do Sul", codigo: "KR" },
  { id: 37, pais: "Irã", codigo: "IR" },
  { id: 38, pais: "Austrália", codigo: "AU" },
  { id: 39, pais: "Arábia Saudita", codigo: "SA" },
  { id: 40, pais: "Iraque", codigo: "IQ" },
  { id: 41, pais: "Indonésia", codigo: "ID" },
  { id: 42, pais: "Uzbequistão", codigo: "UZ" },

  // CONCACAF (excl. anfitriões)
  { id: 43, pais: "Panamá", codigo: "PA" },
  { id: 44, pais: "Costa Rica", codigo: "CR" },
  { id: 45, pais: "Jamaica", codigo: "JM" },

  // OFC
  { id: 46, pais: "Nova Zelândia", codigo: "NZ" },

  // Repescagem intercontinental
  { id: 47, pais: "Ucrânia", codigo: "UA" },
  { id: 48, pais: "Chile", codigo: "CL" },
]
