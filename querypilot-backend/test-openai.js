import dotenv from 'dotenv';
import OpenAI from 'openai';

dotenv.config();

async function testOpenAI() {
    const openaiApiKey = process.env.OPENAI_API_KEY;

    if (!openaiApiKey) {
        console.error('❌ OPENAI_API_KEY not found in .env');
        return;
    }

    console.log('✅ API Key found');
    console.log('🧪 Testing OpenAI API with GPT-4o-mini\n');

    const openai = new OpenAI({
        apiKey: openaiApiKey,
    });

    const testPrompt = `DATABASE SCHEMA CONTEXT:
Database: school
Collections: students (2 documents)
Fields: _id, name, age, hobbies

USER QUESTION: Show me all students

Provide your response as SchemaCat:`;

    try {
        console.log('📡 Calling OpenAI GPT-4o-mini...\n');

        const completion = await openai.chat.completions.create({
            model: 'gpt-4o-mini',
            messages: [
                {
                    role: 'system',
                    content: 'You are SchemaCat, a MongoDB-focused developer assistant.'
                },
                {
                    role: 'user',
                    content: testPrompt
                }
            ],
            temperature: 0.7,
            max_tokens: 500,
        });

        const response = completion.choices[0].message.content;

        console.log('✅ SUCCESS! OpenAI integration is working!\n');
        console.log('='.repeat(80));
        console.log('💬 AI Response:');
        console.log('='.repeat(80));
        console.log(response);
        console.log('='.repeat(80));
        console.log('\n📊 Model:', completion.model);
        console.log('🎯 Tokens used:', completion.usage.total_tokens);

    } catch (error) {
        console.error('\n❌ Error:', error.message);
        if (error.response) {
            console.error('Response:', error.response.data);
        }
    }
}

testOpenAI();
