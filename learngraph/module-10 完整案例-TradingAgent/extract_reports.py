#!/usr/bin/env python3
"""
从 notebook 中提取所有分析报告
"""
import json
import sys

def extract_markdown_from_outputs(outputs):
    """从输出中提取 Markdown 内容"""
    for output in outputs:
        if output.get('output_type') == 'display_data':
            data = output.get('data', {})
            if 'text/markdown' in data:
                return data['text/markdown']
            elif 'text/plain' in data:
                text = data['text/plain']
                if '<IPython.core.display.Markdown object>' in text:
                    continue
                return text
        elif output.get('output_type') == 'stream':
            return output.get('text', '')
        elif output.get('output_type') == 'execute_result':
            data = output.get('data', {})
            if 'text/plain' in data:
                return data['text/plain']
    return None

def extract_reports(notebook_path):
    """从notebook中提取所有报告"""
    with open(notebook_path, 'r', encoding='utf-8') as f:
        nb = json.load(f)

    reports = {}

    # Cell 15: 分析师报告
    cell_15 = nb['cells'][15]
    if cell_15.get('outputs'):
        outputs_text = []
        for output in cell_15['outputs']:
            if output.get('output_type') == 'display_data':
                data = output.get('data', {})
                if 'text/markdown' in data:
                    outputs_text.append(data['text/markdown'])

        # 分析师报告应该有4个
        if len(outputs_text) >= 4:
            reports['market_report'] = outputs_text[0]
            reports['sentiment_report'] = outputs_text[1]
            reports['news_report'] = outputs_text[2]
            reports['fundamentals_report'] = outputs_text[3]

    # Cell 17: 投资辩论
    cell_17 = nb['cells'][17]
    if cell_17.get('outputs'):
        outputs_text = []
        for output in cell_17['outputs']:
            if output.get('output_type') == 'display_data':
                data = output.get('data', {})
                if 'text/markdown' in data:
                    outputs_text.append(data['text/markdown'])

        if len(outputs_text) >= 3:
            reports['bull_history'] = outputs_text[0]
            reports['bear_history'] = outputs_text[1]
            reports['judge_decision'] = outputs_text[2]

    # Cell 19: 交易计划
    cell_19 = nb['cells'][19]
    if cell_19.get('outputs'):
        outputs_text = []
        for output in cell_19['outputs']:
            if output.get('output_type') == 'display_data':
                data = output.get('data', {})
                if 'text/markdown' in data:
                    outputs_text.append(data['text/markdown'])

        if len(outputs_text) >= 2:
            reports['investment_plan'] = outputs_text[0]
            reports['trader_investment_plan'] = outputs_text[1]

    # Cell 21: 风险评估辩论
    cell_21 = nb['cells'][21]
    if cell_21.get('outputs'):
        outputs_text = []
        for output in cell_21['outputs']:
            if output.get('output_type') == 'display_data':
                data = output.get('data', {})
                if 'text/markdown' in data:
                    outputs_text.append(data['text/markdown'])

        if len(outputs_text) >= 4:
            reports['risky_history'] = outputs_text[0]
            reports['safe_history'] = outputs_text[1]
            reports['neutral_history'] = outputs_text[2]
            reports['risk_judge_decision'] = outputs_text[3]

    # Cell 23: 最终决策
    cell_23 = nb['cells'][23]
    if cell_23.get('outputs'):
        for output in cell_23['outputs']:
            if output.get('output_type') == 'display_data':
                data = output.get('data', {})
                if 'text/markdown' in data:
                    reports['final_trade_decision'] = data['text/markdown']

    return reports

if __name__ == '__main__':
    notebook_path = sys.argv[1] if len(sys.argv) > 1 else 'notebook-NVDA_2024-05-10.ipynb'
    reports = extract_reports(notebook_path)

    # 保存为JSON
    output_path = 'extracted_reports.json'
    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump(reports, f, indent=2, ensure_ascii=False)

    print(f"✅ 提取了 {len(reports)} 个报告")
    print(f"📁 保存到: {output_path}")
    for key in reports.keys():
        print(f"   - {key}: {len(reports[key])} 字符")
