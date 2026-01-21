import dotenv from 'dotenv';
import { HfInference } from '@huggingface/inference';

dotenv.config();

async function testMultipleModels() {
    const hfApiKey = process.env.HUGGINGFACE_API_KEY;
    const hf = new HfInference(hfApiKey);

    const testPrompt = 'Write a MongoDB query to find all documents in a collection called students.';

    const modelsToTest = [
        'google/flan-t5-large',
        'tiiuae/falcon-7b-instruct',
        'bigscience/bloom-560m',
        'EleutherAI/gpt-neo-2.7B'
    ];

    for (const modelName of modelsToTest) {
        console.log(`\n${'='.repeat(80)}`);
        console.log(`Testing: ${modelName}`);
        console.log('='.repeat(80));

        try {
            const result = await hf.textGeneration({
                model: modelName,
                inputs: testPrompt,
                parameters: {
                    max_new_tokens: 150,
                    temperature: 0.7,
                    return_full_text: false
                }
            });

            console.log('✅ SUCCESS!');
            console.log('Response:', result.generated_text.substring(0, 200));
            console.log(`\n✅ WORKING MODEL: ${modelName}`);
            break;

        } catch (error) {
            console.log(`❌ ${error.message.substring(0, 100)}`);
        }
    }
}

testMultipleModels();
