#!/usr/bin/env node

// Comprehensive RAG Pipeline Test Script
// Tests document upload, processing, chunking, embedding, search, and answer generation

import http from 'http';

const API_BASE = 'http://localhost:5000';

function makeRequest(method, path, data = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 5000,
      path,
      method,
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(body);
          resolve({ status: res.statusCode, data: parsed });
        } catch (e) {
          resolve({ status: res.statusCode, data: body });
        }
      });
    });

    req.on('error', reject);
    
    if (data) {
      req.write(JSON.stringify(data));
    }
    
    req.end();
  });
}

async function testRAGPipeline() {
  console.log('\n🔄 COMPREHENSIVE RAG PIPELINE TEST\n');
  
  // Test 1: Upload document via JSON (simulating file upload)
  console.log('📁 Test 1: Document Upload');
  const testDocument = {
    filename: 'ai_guide.txt',
    content: `
      Artificial Intelligence and Machine Learning Guide
      
      Introduction to AI:
      Artificial Intelligence (AI) is a branch of computer science that aims to create intelligent machines capable of performing tasks that typically require human intelligence. These tasks include learning, reasoning, problem-solving, perception, and language understanding.
      
      Machine Learning Fundamentals:
      Machine Learning (ML) is a subset of AI that focuses on algorithms and statistical models that enable computers to improve their performance on a specific task through experience. The main types include supervised learning, unsupervised learning, and reinforcement learning.
      
      Deep Learning:
      Deep Learning is a subset of machine learning that uses artificial neural networks with multiple layers (hence "deep") to model and understand complex patterns in data. It has been particularly successful in image recognition, natural language processing, and speech recognition.
      
      Natural Language Processing:
      Natural Language Processing (NLP) is a field of AI that focuses on the interaction between computers and humans through natural language. It involves programming computers to process and analyze large amounts of natural language data.
      
      Applications:
      AI has numerous applications including autonomous vehicles, medical diagnosis, financial trading, recommendation systems, virtual assistants, and robotics.
    `,
    metadata: {
      type: 'educational',
      category: 'ai-ml',
      uploadedBy: 'test-user',
    },
  };

  try {
    const uploadResult = await makeRequest('POST', '/api/documents/upload', testDocument);
    console.log(`✅ Upload Status: ${uploadResult.status}`);
    if (uploadResult.status === 200) {
      console.log(`📄 Document ID: ${uploadResult.data.documentId}`);
      console.log(`📝 Filename: ${uploadResult.data.filename}`);
    } else {
      console.log(`❌ Upload failed: ${JSON.stringify(uploadResult.data)}`);
      return;
    }
  } catch (error) {
    console.log(`❌ Upload error: ${error.message}`);
    return;
  }

  // Wait for processing
  console.log('\n⏳ Waiting 3 seconds for document processing...');
  await new Promise(resolve => setTimeout(resolve, 3000));

  // Test 2: List uploaded documents
  console.log('\n📋 Test 2: List Documents');
  try {
    const documentsResult = await makeRequest('GET', '/api/documents');
    console.log(`✅ Documents Status: ${documentsResult.status}`);
    if (documentsResult.status === 200) {
      console.log(`📚 Total Documents: ${documentsResult.data.length}`);
      documentsResult.data.forEach((doc, idx) => {
        console.log(`   ${idx + 1}. ${doc.filename} (${doc.id})`);
      });
    } else {
      console.log(`❌ Documents failed: ${JSON.stringify(documentsResult.data)}`);
    }
  } catch (error) {
    console.log(`❌ Documents error: ${error.message}`);
  }

  // Test 3: RAG Search
  console.log('\n🔍 Test 3: RAG Search');
  const searchQueries = [
    'What is machine learning?',
    'Tell me about deep learning',
    'What are the applications of AI?',
    'How does natural language processing work?',
  ];

  for (const query of searchQueries) {
    try {
      console.log(`\n🔎 Query: "${query}"`);
      const searchResult = await makeRequest('POST', '/api/search', { 
        query,
        maxResults: 3,
      });
      
      console.log(`✅ Search Status: ${searchResult.status}`);
      if (searchResult.status === 200) {
        console.log(`📊 Results Found: ${searchResult.data.totalResults}`);
        searchResult.data.results.forEach((result, idx) => {
          console.log(`   ${idx + 1}. ${result.document.filename} (similarity: ${result.similarity.toFixed(3)})`);
          console.log(`      📝 Chunks: ${result.chunks.length}`);
          if (result.chunks.length > 0) {
            console.log(`      📖 Preview: ${result.chunks[0].text}`);
          }
        });
      } else {
        console.log(`❌ Search failed: ${JSON.stringify(searchResult.data)}`);
      }
    } catch (error) {
      console.log(`❌ Search error: ${error.message}`);
    }
  }

  // Test 4: RAG Answer Generation
  console.log('\n🤖 Test 4: RAG Answer Generation');
  const answerQueries = [
    'What is the difference between machine learning and deep learning?',
    'What are the main applications of artificial intelligence?',
  ];

  for (const query of answerQueries) {
    try {
      console.log(`\n❓ Question: "${query}"`);
      const answerResult = await makeRequest('POST', '/api/ask-documents', { 
        query,
        model: 'gpt-5',
      });
      
      console.log(`✅ Answer Status: ${answerResult.status}`);
      if (answerResult.status === 200) {
        console.log(`🎯 Confidence: ${answerResult.data.confidence.toFixed(3)}`);
        console.log(`📚 Sources Used: ${answerResult.data.sources.length}`);
        console.log(`🔍 Search Results: ${answerResult.data.searchResults}`);
        
        if (answerResult.data.answer) {
          console.log(`\n💬 Answer: ${answerResult.data.answer}`);
        }
        
        if (answerResult.data.sources.length > 0) {
          console.log('\n📖 Sources:');
          answerResult.data.sources.forEach((source, idx) => {
            console.log(`   ${idx + 1}. ${source.filename}`);
            console.log(`      📄 Excerpt: ${source.chunk}`);
          });
        }
      } else {
        console.log(`❌ Answer failed: ${JSON.stringify(answerResult.data)}`);
      }
    } catch (error) {
      console.log(`❌ Answer error: ${error.message}`);
    }
  }

  // Test 5: System Health Check
  console.log('\n🩺 Test 5: System Health Check');
  try {
    const healthResult = await makeRequest('GET', '/api/admin/metrics');
    console.log(`✅ Health Status: ${healthResult.status}`);
    if (healthResult.status === 200) {
      console.log(`🔄 Uptime: ${Math.floor(healthResult.data.uptime)} seconds`);
      console.log(`💾 Memory Usage: ${Math.floor(healthResult.data.memory.heapUsed / 1024 / 1024)} MB`);
      console.log('📊 System Metrics: Available');
    }
  } catch (error) {
    console.log(`❌ Health check error: ${error.message}`);
  }

  console.log('\n✅ RAG Pipeline Test Complete!\n');
}

// Run tests
testRAGPipeline().catch(console.error);