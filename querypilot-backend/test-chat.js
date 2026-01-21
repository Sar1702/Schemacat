import dotenv from 'dotenv';
import { HfInference } from '@huggingface/inference';

dotenv.config();

async function testChatCompletion() {
    const hfApiKey = process.env.HUGGINGFACE_API_KEY;
    const hf = new HfInference(hfApiKey);

    const modelsToTest = [
        'meta-llama/Llama-3.2-3B-Instruct',
        'microsoft/Phi-3-mini-4k-instruct',
        'mistralai/Mistral-7B-Instruct-v0.3',
        'HuggingFaceH4/zephyr-7b-beta'
    ];

    for (const modelName of modelsToTest) {
        console.log(`\n${'='.repeat(80)}`);
        console.log(`Testing: ${modelName}`);
        console.log('='.repeat(80));

        try {
            const result = await hf.chatCompletion({
                model: modelName,
                messages: [
                    {
                        role: 'user',
                        content: 'Write a MongoDB query to find all documents in a collection called students.'
                    }
                ],
                max_tokens: 200,
                temperature: 0.7
            });

            console.log('✅ SUCCESS!');
            console.log('Response:', result.choices[0].message.content);
            console.log(`\n✅ WORKING MODEL: ${modelName}`);
            break;

        } catch (error) {
            console.log(`❌ ${error.message.substring(0, 150)}`);
        }
    }
}

testChatCompletion();
