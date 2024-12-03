import {HUGGING_API_TOKEN, STABLE_DIFFUSION_API_TOKEN} from '@env';

export const HUGGING_API_URL =
  'https://api-inference.huggingface.co/models/meta-llama/Meta-Llama-3-8B-Instruct/v1/chat/completions';
export const STABLE_DIFFUSION_API_URL =
  'https://modelslab.com/api/v6/realtime/text2img';

export const HUGGING_API_KEY = HUGGING_API_TOKEN;
export const STABLE_DIFFUSION_API_KEY = STABLE_DIFFUSION_API_TOKEN;
