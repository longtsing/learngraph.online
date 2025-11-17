#!/bin/bash
# 提取所有关键报告

NB="notebook-NVDA_2024-05-10.ipynb"

echo "提取 Market Analyst Report..."
cat "$NB" | jq -r '.cells[16].outputs[1].data."text/markdown" | join("")' > market_report.md

echo "提取 Social Analyst Report..."
cat "$NB" | jq -r '.cells[16].outputs[3].data."text/markdown" | join("")' > social_report.md

echo "提取 News Analyst Report..."
cat "$NB" | jq -r '.cells[16].outputs[5].data."text/markdown" | join("")' > news_report.md

echo "提取 Fundamentals Analyst Report..."
cat "$NB" | jq -r '.cells[16].outputs[7].data."text/markdown" | join("")' > fundamentals_report.md

echo "提取 Bull Researcher..."
cat "$NB" | jq -r '.cells[18].outputs[1].data."text/markdown" | join("")' > bull_debate.md

echo "提取 Bear Researcher..."
cat "$NB" | jq -r '.cells[18].outputs[3].data."text/markdown" | join("")' > bear_debate.md

echo "提取 Research Manager..."
cat "$NB" | jq -r '.cells[18].outputs[5].data."text/markdown" | join("")' > research_manager.md

echo "提取 Investment Plan..."
cat "$NB" | jq -r '.cells[20].outputs[1].data."text/markdown" | join("")' > investment_plan.md

echo "提取 Trader Plan..."
cat "$NB" | jq -r '.cells[20].outputs[3].data."text/markdown" | join("")' > trader_plan.md

echo "提取 Risky Analyst..."
cat "$NB" | jq -r '.cells[22].outputs[1].data."text/markdown" | join("")' > risky_analyst.md

echo "提取 Safe Analyst..."
cat "$NB" | jq -r '.cells[22].outputs[3].data."text/markdown" | join("")' > safe_analyst.md

echo "提取 Neutral Analyst..."
cat "$NB" | jq -r '.cells[22].outputs[5].data."text/markdown" | join("")' > neutral_analyst.md

echo "提取 Risk Judge..."
cat "$NB" | jq -r '.cells[22].outputs[7].data."text/markdown" | join("")' > risk_judge.md

echo "提取 Final Decision..."
cat "$NB" | jq -r '.cells[24].outputs[1].data."text/markdown" | join("")' > final_decision.md

echo "✅ 所有报告提取完成!"
