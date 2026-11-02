const base = 'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2F';

function shot(id, w) {
  return base + id + '.png&w=' + w + '&q=85';
}

export const IMG = {
  hero: shot('hf_20261029_023809_d6836117-c958-4680-aa43-1e1973fbc17c', 2400),
  story: shot('hf_20261029_023812_40e3f5f5-a613-4a33-9c78-4cab8b04a992', 2400),
  rites: shot('hf_20261029_023814_b2c8f33a-3c90-4aa1-bb91-cce7f0deb878', 2400),
  night: shot('hf_20261029_023817_3e21faea-ad1c-4723-be92-9b22692094e1', 2400),
  finale: shot('hf_20261029_023819_5b21be3d-159e-4d1d-a3b3-80339bc5d5f1', 2400),
  seam1: shot('hf_20261029_025938_e54c50c3-9748-4d00-af68-886bef6e65e7', 2400),
  seam2: shot('hf_20261029_030022_7a86d576-94d5-4069-b515-62547af3b50c', 2400),
  seam3: shot('hf_20261029_025940_a85237c9-d7e3-4c28-b1d9-71ad7d8cbca4', 2400),
  seam4: shot('hf_20261029_025942_debc2172-5187-4ad4-af0d-307c5e0277b5', 2400),
};
