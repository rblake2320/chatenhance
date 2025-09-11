#!/usr/bin/env node

// Comprehensive Evaluation System Test Script
// Tests evaluation configuration, test execution, and reporting functionality

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

async function testEvaluationSystem() {
  console.log('\n🧪 COMPREHENSIVE EVALUATION SYSTEM TEST\n');
  
  // Test 1: Get test suite information
  console.log('📋 Test 1: Test Suite Information');
  try {
    const suiteResult = await makeRequest('GET', '/api/evaluation/test-suite');
    console.log(`✅ Test Suite Status: ${suiteResult.status}`);
    if (suiteResult.status === 200) {
      console.log(`📚 Suite Name: ${suiteResult.data.metadata?.name || 'Unknown'}`);
      console.log(`🏷️  Categories: ${suiteResult.data.categories?.length || 0} available`);
      console.log(`🧩 Tests: ${suiteResult.data.tests?.length || 0} defined`);
      if (suiteResult.data.categories) {
        console.log(`   Categories: ${suiteResult.data.categories.join(', ')}`);
      }
    } else {
      console.log(`❌ Suite failed: ${JSON.stringify(suiteResult.data)}`);
    }
  } catch (error) {
    console.log(`❌ Suite error: ${error.message}`);
  }

  // Test 2: Get evaluation history (should be empty initially)
  console.log('\n📊 Test 2: Evaluation History');
  try {
    const historyResult = await makeRequest('GET', '/api/evaluation/history');
    console.log(`✅ History Status: ${historyResult.status}`);
    if (historyResult.status === 200) {
      console.log(`📈 Previous Runs: ${historyResult.data.length}`);
      if (historyResult.data.length > 0) {
        historyResult.data.slice(0, 3).forEach((run, idx) => {
          console.log(`   ${idx + 1}. ${run.suite_name} - ${run.overall_score}% (${run.total_tests} tests)`);
        });
      }
    } else {
      console.log(`❌ History failed: ${JSON.stringify(historyResult.data)}`);
    }
  } catch (error) {
    console.log(`❌ History error: ${error.message}`);
  }

  // Test 3: Run a limited evaluation (coding category only for speed)
  console.log('\n🚀 Test 3: Run Sample Evaluation');
  const evaluationConfig = {
    models: ['gpt-5'],
    modes: ['auto'],
    depths: [2],
    categories: ['coding'],
    parallel: false,
  };

  try {
    console.log('🔄 Starting evaluation...');
    console.log(`   Models: ${evaluationConfig.models.join(', ')}`);
    console.log(`   Categories: ${evaluationConfig.categories.join(', ')}`);
    
    const startTime = Date.now();
    const evalResult = await makeRequest('POST', '/api/evaluation/run', evaluationConfig);
    const duration = Date.now() - startTime;
    
    console.log(`✅ Evaluation Status: ${evalResult.status}`);
    console.log(`⏱️  Duration: ${Math.round(duration / 1000)}s`);
    
    if (evalResult.status === 200) {
      const report = evalResult.data;
      console.log(`📊 Overall Score: ${report.summary?.overall_score || 0}%`);
      console.log(`✅ Passed Tests: ${report.metadata?.passed_tests || 0}`);
      console.log(`❌ Failed Tests: ${report.metadata?.failed_tests || 0}`);
      console.log(`⚠️  Error Tests: ${report.metadata?.error_tests || 0}`);
      
      if (report.summary?.category_scores) {
        console.log('\n📈 Category Scores:');
        Object.entries(report.summary.category_scores).forEach(([category, score]) => {
          console.log(`   ${category}: ${score}%`);
        });
      }
      
      if (report.recommendations?.length > 0) {
        console.log('\n💡 Recommendations:');
        report.recommendations.slice(0, 3).forEach((rec, idx) => {
          console.log(`   ${idx + 1}. ${rec}`);
        });
      }
      
      if (report.results?.length > 0) {
        console.log('\n🔍 Sample Results:');
        report.results.slice(0, 2).forEach((result, idx) => {
          console.log(`   ${idx + 1}. ${result.test_name}: ${result.status} (${result.score}/${result.max_score})`);
        });
      }
    } else {
      console.log(`❌ Evaluation failed: ${JSON.stringify(evalResult.data)}`);
    }
  } catch (error) {
    console.log(`❌ Evaluation error: ${error.message}`);
  }

  // Test 4: Check updated history
  console.log('\n📊 Test 4: Updated Evaluation History');
  try {
    const historyResult = await makeRequest('GET', '/api/evaluation/history');
    console.log(`✅ History Status: ${historyResult.status}`);
    if (historyResult.status === 200) {
      console.log(`📈 Total Runs: ${historyResult.data.length}`);
      if (historyResult.data.length > 0) {
        const latest = historyResult.data[0];
        console.log(`📋 Latest Run: ${latest.suite_name}`);
        console.log(`📅 Timestamp: ${new Date(latest.timestamp).toLocaleString()}`);
        console.log(`🎯 Score: ${latest.overall_score}%`);
      }
    }
  } catch (error) {
    console.log(`❌ History check error: ${error.message}`);
  }

  // Test 5: Test export functionality
  console.log('\n📤 Test 5: Export Functionality');
  try {
    const exportResult = await makeRequest('GET', '/api/evaluation/export/json');
    console.log(`✅ Export Status: ${exportResult.status}`);
    if (exportResult.status === 200) {
      console.log('📁 JSON export successful');
      if (exportResult.data.id) {
        console.log(`📋 Export ID: ${exportResult.data.id}`);
        console.log(`📊 Exported Score: ${exportResult.data.overall_score}%`);
      }
    } else {
      console.log(`❌ Export failed: ${JSON.stringify(exportResult.data)}`);
    }
  } catch (error) {
    console.log(`❌ Export error: ${error.message}`);
  }

  // Test 6: System Health Check
  console.log('\n🩺 Test 6: System Health for Evaluation');
  try {
    const healthResult = await makeRequest('GET', '/api/admin/metrics');
    console.log(`✅ Health Status: ${healthResult.status}`);
    if (healthResult.status === 200) {
      console.log(`🔄 System Uptime: ${Math.floor(healthResult.data.uptime)} seconds`);
      console.log(`💾 Memory Usage: ${Math.floor(healthResult.data.memory.heapUsed / 1024 / 1024)} MB`);
      console.log(`📊 Active Agents: ${healthResult.data.system?.activeAgents || 0}`);
      console.log(`📈 Total Requests: ${healthResult.data.system?.totalRequests || 0}`);
    }
  } catch (error) {
    console.log(`❌ Health check error: ${error.message}`);
  }

  console.log('\n✅ Evaluation System Test Complete!\n');
}

// Run tests
testEvaluationSystem().catch(console.error);