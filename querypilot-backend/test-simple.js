import dotenv from 'dotenv';
import { HfInference } from '@huggingface/inference';

dotenv.config();

async function testSimple() {
    const hfApiKey = process.env.HUGGINGFACE_API_KEY;

    console.log('✅ Testing Hugging Face with simple prompt\n');

    const hf = new HfInference(hfApiKey);

    try {
        const result = await hf.textGeneration({
            model: 'HuggingFaceH4/zephyr-7b-beta',
            inputs: 'Write a MongoDB query to find all documents in a collection called students.',
            parameters: {
                max_new_tokens: 200,
                temperature: 0.7,
                return_full_text: false
            }
        });

        console.log('✅ SUCCESS!\n');
        console.log('Response:', result.generated_text);

    } catch (error) {
        console.error('❌ Error:', error.message);
    }
}

testSimple();
