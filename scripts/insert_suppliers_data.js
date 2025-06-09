import * as db from '../backend/db.js';

async function insertSuppliersData() {
  try {
    const insertDataQuery = `
      INSERT INTO Supplier (supplierCode, supplierName, salesPerson, cellNumber, nuitNumber, physicalAddress, emailAddress) VALUES
      ('ACP01', 'AC PECAS ,LDA', 'Okechukwu', '258 87 588 8556', '400 515 931', 'Estrada Nacional 7, Bairro Chingodzi', 'okechukwuchigaemezu@gmail.com'),
      ('ADV01', 'ADVANCED CONSULTORIA E SERVICOS ,LDA', NULL, '258 84  045 9167', NULL, 'Bairro Chingodzi , Tete', 'geral.advanced@outlook.pt'),
      ('AMT01', 'AMTECH ENGINEERING SOLUTIONS', NULL, '848976253', '401 266 402', 'Bairro Chingodzi , Tete', 'sales@amtecheng-solutions.com'),
      ('AF001', 'AUTO FABROS,EI', NULL, '828278688/852899393', NULL, 'Bairro Chingodzi, cidade de Tete', NULL),
      ('AFR01', 'Afrox Moçambique Lda', 'Marcia', '258 84 322 1141', NULL, 'Av. Josina Machel, Parcela no 803.Talhao no 1335 and 1336.Machava, Matola', 'Marcia.Boaventura.Boque@afrox.linde.com'),
      ('ALF01', 'ALFA Comercial Limitada', 'Efremo Manteiga', '258 84 262 0614', NULL, 'EN7 Retunda do Mpadue , Tete, Mocambique.', 'sales@alfacomercialda.com'),
      ('AP01', 'AUTO PROSPER, Sociedade Unipessoal, Limitada', NULL, '842496863/866355346', '400671516', 'Biarro Chingodzi, cidade de Tete', NULL),
      ('ARY01', 'ARYLINE $ HYDRAULICS MOZAMBIQUE LDA', NULL, NULL, NULL, 'EN22 Estrada da Zambia ,Bairro Matundo', 'arylyne-office@yahoo.com'),
      ('AVC01', 'AUTO VIDREIRA CUMUNDA', 'VICTOR CUMUNDA', '873022967/849090903', NULL, 'Bairro Samora Machel', NULL),
      ('AWL001', 'AWELE MERCHANT', 'Awele', '862893442/843780082', NULL, NULL, 'awelemerchant@yahoo.com'),
      ('BAT01', 'BATHENS NOLLY E AUTO VENTURES, E.I', NULL, '258 84 692 8523', NULL, 'Bairro Samora Machel. Canongola', NULL),
      ('BEP', 'BLESSED EMMANUEL PECAS', NULL, '863723523/84559780', NULL, NULL, NULL),
      ('BMG01', 'BEARING MAN GROUP MAPUTO LDA', 'Themba', '258 84 310 6960', '400221987', 'AV. DAS INDUSTRIAS, NO 163, MACHAVA, MAPUTO', 'Thembas@bmgworld.net'),
      ('BRM01', 'BSSC RADIATORS MOZAMBIQUE', NULL, '858320090', '401751807', NULL, NULL);
    `;
    await db.pool.execute(insertDataQuery);
    console.log('Sample data inserted into Supplier table successfully.');
  } catch (error) {
    console.error('Error inserting sample data into Supplier table:', error);
  } finally {
    // Close the pool if this is the only script running
    // db.pool.end();
  }
}

insertSuppliersData();