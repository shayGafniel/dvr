import { GetInvoiceByIdServerBody } from '../../../models/invoices-models/invoice.model';

export let mock_invoices_count: (vendorIds: number[]) => any = vendorIds => {
  return Object.assign({}, ...vendorIds.map(vendorId => ({ [vendorId]: vendorId })));
};

export class MockInvoicesList {
  public static mockInvoices() {
    return {
      invoices: [
        {
          id: 69526076,
          url: 'https://app.k8rnd.vatbox.com/console/agent_invoices/69526076?from_select=1',
          invoice_number: null,
          country: {
            code: null,
            name: null,
          },
          category: null,
          invoice_date: null,
          invoice_amount: 100,
          reclaim_amount: null,
          vat_rate: null,
          status: 'Auto-filled',
          origin_invoice_status: 'No Need Origin Invoice',
          company: {
            name: '152/866/864 - Eli Lilly and Company LTD Test',
            url: 'https://app.k8rnd.vatbox.com/console/companies/5931',
          },
          scan_url:
            'http://res.cloudinary.com/vatbox-staging/image/upload/v1/imaginary/6b1b7465-da27-4714-9fce-c90fa35d5cc8.jpeg',
        },
        {
          id: 69526075,
          url: 'https://app.k8rnd.vatbox.com/console/agent_invoices/69526075?from_select=1',
          invoice_number: null,
          country: {
            code: null,
            name: null,
          },
          category: null,
          invoice_date: null,
          invoice_amount: 100,
          reclaim_amount: null,
          vat_rate: null,
          status: 'Auto-filled',
          origin_invoice_status: 'No Need Origin Invoice',
          company: {
            name: '152/866/864 - Eli Lilly and Company LTD Test',
            url: 'https://app.k8rnd.vatbox.com/console/companies/5931',
          },
          scan_url:
            'http://res.cloudinary.com/vatbox-staging/image/upload/v1/imaginary/c55a9d2e-ccae-471c-adae-0e27201688e4.jpeg',
        },
        {
          id: 69526074,
          url: 'https://app.k8rnd.vatbox.com/console/agent_invoices/69526074?from_select=1',
          invoice_number: null,
          country: {
            code: null,
            name: null,
          },
          category: null,
          invoice_date: null,
          invoice_amount: 100,
          reclaim_amount: null,
          vat_rate: null,
          status: 'Auto-filled',
          origin_invoice_status: {
            id: 1,
            name: 'No Need Origin Invoice'
          },
          company: {
            name: '152/866/864 - Eli Lilly and Company LTD Test',
            url: 'https://app.k8rnd.vatbox.com/console/companies/5931',
          },
          scan_url:
            'http://res.cloudinary.com/vatbox-staging/image/upload/v1/imaginary/9b753882-83ba-45b2-9578-c218f6758158.jpeg',
        },
        {
          id: 69526073,
          url: 'https://app.k8rnd.vatbox.com/console/agent_invoices/69526073?from_select=1',
          invoice_number: null,
          country: {
            code: null,
            name: null,
          },
          category: null,
          invoice_date: null,
          invoice_amount: 100,
          reclaim_amount: null,
          vat_rate: null,
          status: 'Auto-filled',
          origin_invoice_status: 'No Need Origin Invoice',
          company: {
            name: '152/866/864 - Eli Lilly and Company LTD Test',
            url: 'https://app.k8rnd.vatbox.com/console/companies/5931',
          },
          scan_url:
            'http://res.cloudinary.com/vatbox-staging/image/upload/v1/imaginary/0244aa68-d69e-4672-9b0b-16eaccb794d6.jpeg',
        },
        {
          id: 69526072,
          url: 'https://app.k8rnd.vatbox.com/console/agent_invoices/69526072?from_select=1',
          invoice_number: null,
          country: {
            code: null,
            name: null,
          },
          category: null,
          invoice_date: null,
          invoice_amount: 100,
          reclaim_amount: null,
          vat_rate: null,
          status: 'Auto-filled',
          origin_invoice_status: 'No Need Origin Invoice',
          company: {
            name: '152/866/864 - Eli Lilly and Company LTD Test',
            url: 'https://app.k8rnd.vatbox.com/console/companies/5931',
          },
          scan_url:
            'http://res.cloudinary.com/vatbox-staging/image/upload/v1/imaginary/5238e5ed-176a-497b-8aba-631d0771fc98.jpeg',
        },
        {
          id: 69526071,
          url: 'https://app.k8rnd.vatbox.com/console/agent_invoices/69526071?from_select=1',
          invoice_number: null,
          country: {
            code: null,
            name: null,
          },
          category: null,
          invoice_date: null,
          invoice_amount: 100,
          reclaim_amount: null,
          vat_rate: null,
          status: 'Auto-filled',
          origin_invoice_status: 'No Need Origin Invoice',
          company: {
            name: '152/866/864 - Eli Lilly and Company LTD Test',
            url: 'https://app.k8rnd.vatbox.com/console/companies/5931',
          },
          scan_url:
            'http://res.cloudinary.com/vatbox-staging/image/upload/v1/imaginary/1b5dba40-1a5c-4526-a9be-7e80c5d80e45.jpeg',
        },
        {
          id: 69526070,
          url: 'https://app.k8rnd.vatbox.com/console/agent_invoices/69526070?from_select=1',
          invoice_number: null,
          country: {
            code: null,
            name: null,
          },
          category: null,
          invoice_date: null,
          invoice_amount: 100,
          reclaim_amount: null,
          vat_rate: null,
          status: 'Auto-filled',
          origin_invoice_status: 'No Need Origin Invoice',
          company: {
            name: '152/866/864 - Eli Lilly and Company LTD Test',
            url: 'https://app.k8rnd.vatbox.com/console/companies/5931',
          },
          scan_url:
            'http://res.cloudinary.com/vatbox-staging/image/upload/v1/imaginary/c342f61d-9195-4f24-b422-2570d78b9a92.jpeg',
        },
        {
          id: 69526069,
          url: 'https://app.k8rnd.vatbox.com/console/agent_invoices/69526069?from_select=1',
          invoice_number: null,
          country: {
            code: null,
            name: null,
          },
          category: null,
          invoice_date: null,
          invoice_amount: 100,
          reclaim_amount: null,
          vat_rate: null,
          status: 'Auto-filled',
          origin_invoice_status: 'No Need Origin Invoice',
          company: {
            name: '152/866/864 - Eli Lilly and Company LTD Test',
            url: 'https://app.k8rnd.vatbox.com/console/companies/5931',
          },
          scan_url:
            'http://res.cloudinary.com/vatbox-staging/image/upload/v1/imaginary/e6ec1fd6-511c-4211-bba3-93dba3c44a78.jpeg',
        },
        {
          id: 69526068,
          url: 'https://app.k8rnd.vatbox.com/console/agent_invoices/69526068?from_select=1',
          invoice_number: null,
          country: {
            code: null,
            name: null,
          },
          category: null,
          invoice_date: null,
          invoice_amount: 100,
          reclaim_amount: null,
          vat_rate: null,
          status: 'Auto-filled',
          origin_invoice_status: 'No Need Origin Invoice',
          company: {
            name: '152/866/864 - Eli Lilly and Company LTD Test',
            url: 'https://app.k8rnd.vatbox.com/console/companies/5931',
          },
          scan_url:
            'http://res.cloudinary.com/vatbox-staging/image/upload/v1/imaginary/90def811-e6e4-4933-9a52-4389505bf7f6.jpeg',
        },
        {
          id: 69526067,
          url: 'https://app.k8rnd.vatbox.com/console/agent_invoices/69526067?from_select=1',
          invoice_number: null,
          country: {
            code: null,
            name: null,
          },
          category: null,
          invoice_date: null,
          invoice_amount: 100,
          reclaim_amount: null,
          vat_rate: null,
          status: 'Auto-filled',
          origin_invoice_status: 'No Need Origin Invoice',
          company: {
            name: '152/866/864 - Eli Lilly and Company LTD Test',
            url: 'https://app.k8rnd.vatbox.com/console/companies/5931',
          },
          scan_url:
            'http://res.cloudinary.com/vatbox-staging/image/upload/v1/imaginary/9544f30b-ad53-4fcd-9866-ff8223cb47e0.jpeg',
        },
        {
          id: 69526066,
          url: 'https://app.k8rnd.vatbox.com/console/agent_invoices/69526066?from_select=1',
          invoice_number: null,
          country: {
            code: null,
            name: null,
          },
          category: null,
          invoice_date: null,
          invoice_amount: 100,
          reclaim_amount: null,
          vat_rate: null,
          status: 'Auto-filled',
          origin_invoice_status: 'No Need Origin Invoice',
          company: {
            name: '152/866/864 - Eli Lilly and Company LTD Test',
            url: 'https://app.k8rnd.vatbox.com/console/companies/5931',
          },
          scan_url:
            'http://res.cloudinary.com/vatbox-staging/image/upload/v1/imaginary/9d2fa90b-167a-4ad7-9a71-1e6947743f82.jpeg',
        },
        {
          id: 69526065,
          url: 'https://app.k8rnd.vatbox.com/console/agent_invoices/69526065?from_select=1',
          invoice_number: null,
          country: {
            code: null,
            name: null,
          },
          category: null,
          invoice_date: null,
          invoice_amount: 100,
          reclaim_amount: null,
          vat_rate: null,
          status: 'Auto-filled',
          origin_invoice_status: 'No Need Origin Invoice',
          company: {
            name: '152/866/864 - Eli Lilly and Company LTD Test',
            url: 'https://app.k8rnd.vatbox.com/console/companies/5931',
          },
          scan_url:
            'http://res.cloudinary.com/vatbox-staging/image/upload/v1/imaginary/b954bab0-fcc9-4fb2-ab74-305f79f95ae3.jpeg',
        },
        {
          id: 69526064,
          url: 'https://app.k8rnd.vatbox.com/console/agent_invoices/69526064?from_select=1',
          invoice_number: null,
          country: {
            code: null,
            name: null,
          },
          category: null,
          invoice_date: null,
          invoice_amount: 100,
          reclaim_amount: null,
          vat_rate: null,
          status: 'Auto-filled',
          origin_invoice_status: 'No Need Origin Invoice',
          company: {
            name: '152/866/864 - Eli Lilly and Company LTD Test',
            url: 'https://app.k8rnd.vatbox.com/console/companies/5931',
          },
          scan_url:
            'http://res.cloudinary.com/vatbox-staging/image/upload/v1/imaginary/d86164fc-c80a-4fb8-aafd-38d4dc4edd6d.jpeg',
        },
        {
          id: 69526063,
          url: 'https://app.k8rnd.vatbox.com/console/agent_invoices/69526063?from_select=1',
          invoice_number: null,
          country: {
            code: null,
            name: null,
          },
          category: null,
          invoice_date: null,
          invoice_amount: 100,
          reclaim_amount: null,
          vat_rate: null,
          status: 'Auto-filled',
          origin_invoice_status: 'No Need Origin Invoice',
          company: {
            name: '152/866/864 - Eli Lilly and Company LTD Test',
            url: 'https://app.k8rnd.vatbox.com/console/companies/5931',
          },
          scan_url:
            'http://res.cloudinary.com/vatbox-staging/image/upload/v1/imaginary/1732d5bf-b094-4d4c-8ac1-ba26aa106d5c.jpeg',
        },
        {
          id: 69526062,
          url: 'https://app.k8rnd.vatbox.com/console/agent_invoices/69526062?from_select=1',
          invoice_number: null,
          country: {
            code: null,
            name: null,
          },
          category: null,
          invoice_date: null,
          invoice_amount: 100,
          reclaim_amount: null,
          vat_rate: null,
          status: 'Auto-filled',
          origin_invoice_status: 'No Need Origin Invoice',
          company: {
            name: '152/866/864 - Eli Lilly and Company LTD Test',
            url: 'https://app.k8rnd.vatbox.com/console/companies/5931',
          },
          scan_url:
            'http://res.cloudinary.com/vatbox-staging/image/upload/v1/imaginary/d18529c9-33d0-4157-8cd6-8a55b05a2509.jpeg',
        },
        {
          id: 69526061,
          url: 'https://app.k8rnd.vatbox.com/console/agent_invoices/69526061?from_select=1',
          invoice_number: null,
          country: {
            code: null,
            name: null,
          },
          category: null,
          invoice_date: null,
          invoice_amount: 100,
          reclaim_amount: null,
          vat_rate: null,
          status: 'Auto-filled',
          origin_invoice_status: 'No Need Origin Invoice',
          company: {
            name: '152/866/864 - Eli Lilly and Company LTD Test',
            url: 'https://app.k8rnd.vatbox.com/console/companies/5931',
          },
          scan_url:
            'http://res.cloudinary.com/vatbox-staging/image/upload/v1/imaginary/cf249c3b-3b59-4918-94a1-d058676ec0d1.jpeg',
        },
        {
          id: 69526060,
          url: 'https://app.k8rnd.vatbox.com/console/agent_invoices/69526060?from_select=1',
          invoice_number: null,
          country: {
            code: null,
            name: null,
          },
          category: null,
          invoice_date: null,
          invoice_amount: 100,
          reclaim_amount: null,
          vat_rate: null,
          status: 'Auto-filled',
          origin_invoice_status: 'No Need Origin Invoice',
          company: {
            name: '152/866/864 - Eli Lilly and Company LTD Test',
            url: 'https://app.k8rnd.vatbox.com/console/companies/5931',
          },
          scan_url:
            'http://res.cloudinary.com/vatbox-staging/image/upload/v1/imaginary/babbd43f-dc1d-4fe9-9bfb-7c46f2befecc.jpeg',
        },
        {
          id: 69526059,
          url: 'https://app.k8rnd.vatbox.com/console/agent_invoices/69526059?from_select=1',
          invoice_number: null,
          country: {
            code: null,
            name: null,
          },
          category: null,
          invoice_date: null,
          invoice_amount: 100,
          reclaim_amount: null,
          vat_rate: null,
          status: 'Auto-filled',
          origin_invoice_status: 'No Need Origin Invoice',
          company: {
            name: '152/866/864 - Eli Lilly and Company LTD Test',
            url: 'https://app.k8rnd.vatbox.com/console/companies/5931',
          },
          scan_url:
            'http://res.cloudinary.com/vatbox-staging/image/upload/v1/imaginary/022b946c-97bb-4b60-be7c-3d61ef1092b9.jpeg',
        },
        {
          id: 69526058,
          url: 'https://app.k8rnd.vatbox.com/console/agent_invoices/69526058?from_select=1',
          invoice_number: null,
          country: {
            code: null,
            name: null,
          },
          category: null,
          invoice_date: null,
          invoice_amount: 100,
          reclaim_amount: null,
          vat_rate: null,
          status: 'Auto-filled',
          origin_invoice_status: 'No Need Origin Invoice',
          company: {
            name: '152/866/864 - Eli Lilly and Company LTD Test',
            url: 'https://app.k8rnd.vatbox.com/console/companies/5931',
          },
          scan_url:
            'http://res.cloudinary.com/vatbox-staging/image/upload/v1/imaginary/c291220f-79d0-4a1c-982d-15afed78d3e2.jpeg',
        },
        {
          id: 69526057,
          url: 'https://app.k8rnd.vatbox.com/console/agent_invoices/69526057?from_select=1',
          invoice_number: null,
          country: {
            code: null,
            name: null,
          },
          category: null,
          invoice_date: null,
          invoice_amount: 100,
          reclaim_amount: null,
          vat_rate: null,
          status: 'Auto-filled',
          origin_invoice_status: 'No Need Origin Invoice',
          company: {
            name: '152/866/864 - Eli Lilly and Company LTD Test',
            url: 'https://app.k8rnd.vatbox.com/console/companies/5931',
          },
          scan_url:
            'http://res.cloudinary.com/vatbox-staging/image/upload/v1/imaginary/d61188af-a468-4e3c-a672-5eb3ec1ccec0.jpeg',
        },
      ],
      pages: 1432,
    };
  }
}

export class MockInvoiceById {
  public static mockInvoice(): GetInvoiceByIdServerBody {
    return {
      invoice: {
        id: 69526076,
        directive: '13',
        commission_type: {
          id: 1,
          name: 'test',
        },
        claim_vat_amount: '14$',
        status: 'ready',
        invoice_history: 'bla bla',
        account_comments_for_processing: 'bla bla',
        expense_domain: 'T&E',
        paid_by: 'who',
        account: 'mr mock',
        report: '1234',
        country: {
          name: 'Israel',
          code: 'IL',
        },
        expense_type: {
          id: 4,
          name: 'hotel',
        },
        invoice_date: '14/12/2019',
        invoice_name: 'ya',
        total_amount: 23,
        approved_amount: 23.123,
        currency: 'EUR',
        total_claim_vat_amount: 12,
        total_vat_paid: 15,
        total_net_amount: 19,
        vat_rate: 20,
        claim_vat_rate: 22,
        supplier: {
          id: 123,
          address_id: 'test',
          name: 'gigig',
          address: 'jghjk',
          vat_id: 'ghjm',
          tax_id: 'h,nl',
          url: 'www.rtyui',
        },
        valid_company_names_by_client_policy: 'fahkl',
        valid_company_names_by_cvatbox_policy: 'jlhskj',
        company_name_on_invoice: 'abf,sh',
        company_name_and_address: {
          id: 0,
          name: 'sa,gb',
        },
        employee_name: 'fvmz,',
        employee_name_and_address: {
          id: 0,
          name: 'sfg',
        },
        client_vat_id_on_invoice: {
          company_vat_id_type: 12,
          company_vat_id_value: 'sdgf',
        },
        document_type: {
          id: 43,
          name: 'fvz',
        },
        is_simplified: true,
        proof_of_payment_existence: true,
        wrongly_charged: true,
        ng_status: {
          id: 43,
          reason: 'hdg',
          status: 'svf',
          suspected_duplicates: 'sgre',
        },
        duplication_status: 'sdfg',
        origin_invoice_status: {
          id: 1,
          name: 'sdfg',
        },
        invoice_status: {
          id: 5346,
          name: 'sgfd',
        },
        reject_reason: {
          id: 5634,
          name: 'sfgd',
        },
        reissue_reason: {
          id: 34,
          type: 'sfdg',
        },
        reclaim: {
          id: 123,
          url: '4235',
          status: 'dsfg',
          refund_amount: 'gfsd',
          gap_amount: 'sgfd',
          agent: 3756,
        },
        vatbox_comments: 'sfdg',
        vat_breakdowns: [
          {
            id: 0,
            percent: 12.5,
            amount: 20,
            vat_amount: 20,
            category_id: 4,
            claim_vat_amount: 14,
            exclude_vat_amount: 15.25,
          },
        ],
        scans: [
          {
            id: 0,
            imaginary_id: '1234',
            selected: false,
          }
        ],
        guest_indication: false,
        personal_expense: true,
        guest_count: 1,
        attendees_count: 2,
        province: 'testProvince'
      },
    };
  }

  public static mockInvoice_2(): GetInvoiceByIdServerBody {
    return {
      invoice: {
        id: 69526075,
        directive: '15',
        claim_vat_amount: '14$',
        status: 'ready',
        invoice_history: 'bla bla bla',
        account_comments_for_processing: 'bla bla bla',
        expense_domain: 'T&E',
        paid_by: 'who',
        account: 'mr mock',
        report: '1234',
        country: {
          name: 'Israel',
          code: 'IL',
        },
        expense_type: {
          id: 4,
          name: 'hotel',
        },
        invoice_date: '14/12/2019',
        invoice_name: 'ya',
        total_amount: 23,
        approved_amount: 1234.1234,
        currency: 'EUR',
        total_claim_vat_amount: 12,
        total_vat_paid: 15,
        total_net_amount: 19,
        vat_rate: 20,
        claim_vat_rate: 22,
        supplier: {
          id: 123,
          address_id: 'test',
          name: 'gigig',
          address: 'jghjk',
          vat_id: 'ghjm',
          tax_id: 'h,nl',
          url: 'www.rtyui',
        },
        valid_company_names_by_client_policy: 'fahkl',
        valid_company_names_by_cvatbox_policy: 'jlhskj',
        company_name_on_invoice: 'abf,sh',
        company_name_and_address: {
          id: 0,
          name: 'sa,gb',
        },
        employee_name: 'fvmz,',
        employee_name_and_address: {
          id: 0,
          name: 'sfg',
        },
        client_vat_id_on_invoice: {
          company_vat_id_type: 12,
          company_vat_id_value: 'sdgf',
        },
        document_type: {
          id: 43,
          name: 'fvz',
        },
        is_simplified: true,
        proof_of_payment_existence: true,
        wrongly_charged: true,
        ng_status: {
          id: 43,
          reason: 'hdg',
          status: 'svf',
          suspected_duplicates: 'sgre',
        },
        duplication_status: 'sdfg',
        origin_invoice_status: {
          id: 1,
          name: 'test'
        },
        invoice_status: {
          id: 5346,
          name: 'sgfd',
        },
        reject_reason: {
          id: 5634,
          name: 'sfgd',
        },
        reissue_reason: {
          id: 34,
          type: 'sfdg',
        },
        commission_type: {
          id: 3746,
          name: 'gsfd',
        },
        reclaim: {
          id: 123,
          url: '4235',
          status: 'dsfg',
          refund_amount: 'gfsd',
          gap_amount: 'sgfd',
          agent: 3756,
        },
        vatbox_comments: 'sfdg',
        vat_breakdowns: [
          {
            id: 0,
            percent: 12.5,
            amount: 20,
            vat_amount: 20,
            category_id: 4,
            claim_vat_amount: 14,
            exclude_vat_amount: 15.25,
          },
        ],
        scans: [
          {
            id: 0,
            selected: false,
            imaginary_id: '123',
          }
        ],
        guest_indication: true,
        personal_expense: false,
        guest_count: 1,
        attendees_count: 1,
        province: 'testtest',
      },
    };
  }
}
