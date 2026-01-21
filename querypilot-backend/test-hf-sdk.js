import dotenv from 'dotenv';
import { HfInference } from '@huggingface/inference';

dotenv.config();

async function testWithSDK() {
    const hfApiKey = process.env.HUGGINGFACE_API_KEY;

    if (!hfApiKey) {
        console.error('❌ HUGGINGFACE_API_KEY not found in .env');
        return;
    }

    console.log('✅ API Key found');
    console.log('🧪 Testing with Hugging Face Inference SDK...\n');

    const hf = new HfInference(hfApiKey);

    const testPrompt = `You are SchemaCat, a MongoDB assistant.

DATABASE SCHEMA CONTEXT:
Database: school
Collections: students (2 documents)
Fields: _id, name, age, hobbies

USER QUESTION: Show me all students

Provide your response as SchemaCat:`;

    const modelsToTest = [
        'meta-llama/Llama-3.2-3B-Instruct',
        'microsoft/Phi-3-mini-4k-instruct',
        'HuggingFaceH4/zephyr-7b-beta',
        'mistralai/Mistral-7B-Instruct-v0.3'
    ];

    for (const modelName of modelsToTest) {
        console.log(`\n${'='.repeat(80)}`);
        console.log(`Testing model: ${modelName}`);
        console.log('='.repeat(80));

        try {
            let fullResponse = '';

            const stream = await hf.textGenerationStream({
                model: modelName,
                inputs: testPrompt,
                parameters: {
                    max_new_tokens: 300,
                    temperature: 0.7,
                    return_full_text: false
                }
            });

            for await (const chunk of stream) {
                if (chunk.token?.text) {
                    fullResponse += chunk.token.text;
                }
            }

            console.log('✅ SUCCESS! Response received\n');
            console.log('💬 AI Response:');
            console.log('─'.repeat(80));
            console.log(fullResponse);
            console.log('─'.repeat(80));

            console.log(`\n✅ WORKING MODEL FOUND: ${modelName}`);
            break;

        } catch (error) {
            console.error(`❌ Error with ${modelName}:`, error.message);
        }
    }
}

testWithSDK();
