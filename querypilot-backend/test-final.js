import dotenv from 'dotenv';
import { HfInference } from '@huggingface/inference';

dotenv.config();

async function testFinalIntegration() {
    const hfApiKey = process.env.HUGGINGFACE_API_KEY;

    if (!hfApiKey) {
        console.error('❌ HUGGINGFACE_API_KEY not found in .env');
        return;
    }

    console.log('✅ API Key found');
    console.log('🧪 Testing Hugging Face Integration with Zephyr-7B-Beta\n');

    const hf = new HfInference(hfApiKey);

    const testPrompt = `You are SchemaCat, a MongoDB-focused developer assistant.

DATABASE SCHEMA CONTEXT:
Database: school
Collections: students (2 documents)
Fields: _id, name, age, hobbies

USER QUESTION: Show me all students

Provide your response as SchemaCat:`;

    try {
        console.log('📡 Calling HuggingFaceH4/zephyr-7b-beta...\n');

        let fullResponse = '';

        const stream = await hf.textGenerationStream({
            model: 'HuggingFaceH4/zephyr-7b-beta',
            inputs: testPrompt,
            parameters: {
                max_new_tokens: 500,
                temperature: 0.7,
                return_full_text: false
            }
        });

        process.stdout.write('💬 Streaming response: ');

        for await (const chunk of stream) {
            if (chunk.token?.text) {
                fullResponse += chunk.token.text;
                process.stdout.write(chunk.token.text);
            }
        }

        console.log('\n\n' + '='.repeat(80));
        console.log('✅ SUCCESS! Hugging Face integration is working!');
        console.log('='.repeat(80));
        console.log('\n📊 Response length:', fullResponse.length, 'characters');
        console.log('🎯 Model: HuggingFaceH4/zephyr-7b-beta');
        console.log('✨ Streaming: Enabled');

    } catch (error) {
        console.error('\n❌ Error:', error.message);
        console.error('Stack:', error.stack);
    }
}

testFinalIntegration();
