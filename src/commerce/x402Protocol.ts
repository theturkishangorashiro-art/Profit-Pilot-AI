export interface PaymentRequirement {
  status: 402;
  message: string;
  paymentDetails: {
    network: 'solana' | 'base' | 'arbitrum';
    token: 'USDC';
    recipientWallet: string;
    amountUsdc: number;
    paymentHeader: string;
  };
}

export class X402ProtocolHandler {
  private recipientWallet: string;

  constructor(recipientWallet?: string) {
    this.recipientWallet = recipientWallet || '0x71C7656EC7ab88b098defB751B7401B5f6d8976F';
  }

  public createPaymentChallenge(endpoint: string, priceUsdc: number, network: 'solana' | 'base' = 'solana'): PaymentRequirement {
    return {
      status: 402,
      message: `Payment Required for endpoint ${endpoint}`,
      paymentDetails: {
        network,
        token: 'USDC',
        recipientWallet: this.recipientWallet,
        amountUsdc: priceUsdc,
        paymentHeader: 'X-Payment-Signature',
      },
    };
  }

  public verifyPaymentHeader(headerValue?: string): boolean {
    if (!headerValue) return false;
    // Simulated signature validation for x402 header
    return headerValue.startsWith('x402_sig_') || headerValue.length > 20;
  }
}
