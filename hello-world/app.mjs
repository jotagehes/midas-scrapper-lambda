import axios from 'axios';
import * as cheerio from 'cheerio';

export const lambdaHandler = async (event, context) => {
    for (const record of event.Records) {
        const messageBody = JSON.parse(record.body);
        const url = messageBody.Message;

        try {
            const response = await axios.get(url);
            const $ = cheerio.load(response.data);

            const companyName = $('th.text-uppercase h4 b').text();
            const cnpjIEText = $('td').first().text();
            const cnpj = cnpjIEText.match(/CNPJ: (\d+\.\d+\.\d+\/\d+-\d+)/)[1];
            const inscricaoEstadual = cnpjIEText.match(/Inscrição Estadual: ([\d.]+)/)[1];
            const address = $('td').eq(1).text().trim();
            const products = [];
            $('#myTable tr').each((index, element) => {
                const productDetails = $(element).find('td').first().text().trim().split('\n');
                const product = productDetails[0];
                const code = productDetails[1].match(/\(Código: (\d+)\)/)[1];
                const quantity = $(element).find('td').eq(1).text().split(': ')[1];
                const unit = $(element).find('td').eq(2).text().split(': ')[1];
                const totalValue = $(element).find('td').eq(3).text().split(' R$: ')[1];

                products.push({ product, code, quantity, unit, totalValue });
            });

            const totalItems = $('strong:contains("Qtde total de ítens")').parent().next().find('strong').text();
            const totalValue = $('strong:contains("Valor total R$")').parent().next().find('strong').text();

            const valuePaid = $('strong:contains("Valor pago R$")').parent().next().find('strong').text();
            const paymentMethod = $('#formPrincipal\\:j_idt74\\:0\\:j_idt82').text();

            const data = {
                companyName,
                cnpj,
                inscricaoEstadual,
                address,
                products,
                summary: {
                    totalItems,
                    totalValue,
                    valuePaid,
                    paymentMethod
                }
            };

            console.log(data);

        } catch (error) {
            console.error(error);
        }
    }
};