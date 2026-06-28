type PaystackInitializeResponse = {
  status: boolean;
  message: string;
  data?: { authorization_url: string; access_code: string; reference: string };
};

type PaystackVerifyResponse = {
  status: boolean;
  message: string;
  data?: { status: string; reference: string; amount: number; currency: string };
};

function getSecret() {
  const secret = process.env.PAYSTACK_SECRET_KEY;
  if (!secret) throw new Error('PAYSTACK_SECRET_KEY is missing.');
  return secret;
}

export async function initializePaystackTransaction(input: {
  email: string;
  amountKobo: number;
  reference: string;
  callbackUrl: string;
  metadata?: Record<string, unknown>;
}) {
  const response = await fetch('https://api.paystack.co/transaction/initialize', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${getSecret()}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email: input.email,
      amount: input.amountKobo,
      reference: input.reference,
      callback_url: input.callbackUrl,
      metadata: input.metadata ?? {},
    }),
    cache: 'no-store',
  });
  if (!response.ok) throw new Error(`Paystack init failed (${response.status})`);
  const json = (await response.json()) as PaystackInitializeResponse;
  if (!json.status || !json.data?.authorization_url) {
    throw new Error(json.message || 'Could not initialize payment.');
  }
  return json.data;
}

export async function verifyPaystackTransaction(reference: string) {
  const response = await fetch(`https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${getSecret()}`,
      'Content-Type': 'application/json',
    },
    cache: 'no-store',
  });
  if (!response.ok) throw new Error(`Paystack verify failed (${response.status})`);
  const json = (await response.json()) as PaystackVerifyResponse;
  if (!json.status || !json.data) {
    throw new Error(json.message || 'Could not verify transaction.');
  }
  return json.data;
}
