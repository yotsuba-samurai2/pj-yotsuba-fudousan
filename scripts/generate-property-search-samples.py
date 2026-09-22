#!/usr/bin/env python3
"""Generate multilingual, fictional property-comparison sample PDFs.

The PDFs are public website assets. Every value is intentionally fictional and
each page carries a disclaimer so the samples cannot be mistaken for listings.
"""

from __future__ import annotations

import argparse
from dataclasses import dataclass
from pathlib import Path
from xml.sax.saxutils import escape

from PIL import Image
from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER, TA_LEFT
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.units import mm
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfgen import canvas
from reportlab.platypus import Paragraph, Table, TableStyle


ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "public" / "samples" / "property-search"
TMP = ROOT / "tmp" / "pdfs" / "property-search-samples"
LOGO = ROOT / "public" / "yotsuba" / "realestate-horizontal.png"
FONT_PATH = Path("/System/Library/Fonts/Supplemental/Arial Unicode.ttf")

GREEN = colors.HexColor("#086844")
GREEN_DARK = colors.HexColor("#064B33")
MINT = colors.HexColor("#E6F3ED")
PINK = colors.HexColor("#D9466B")
INK = colors.HexColor("#17211D")
TEXT = colors.HexColor("#33433C")
MUTED = colors.HexColor("#68766F")
BORDER = colors.HexColor("#CAD7D1")
PAPER = colors.HexColor("#FAFCFB")
AMBER = colors.HexColor("#A86600")

LOCALES = ("ja", "en", "zh-tw", "zh")


I18N = {
    "ja": {
        "sample": "公開サンプル / 架空例",
        "candidate": "候補",
        "comparison": "候補8件の比較",
        "detail": "候補の詳細",
        "first_fit": "一次評価",
        "good": "比較的合う",
        "caution": "条件付き",
        "check": "要確認",
        "confirmed": "資料上確認",
        "unconfirmed": "追加確認",
        "not_applicable": "対象外",
        "plan": "配置イメージ",
        "facts": "比較の基本情報",
        "checks": "契約前に確認すること",
        "costs": "費用・収支の見方",
        "next": "次の進め方",
        "cta": "希望条件をお知らせください。この形式で実際の候補資料を作成します。",
        "fictional": "掲載する物件名・所在地・金額・間取り・収支はすべて説明用の架空例です。募集中物件の広告ではありません。",
        "no_guarantee": "用途承諾、許認可、指定、融資、収益または契約成立を保証する資料ではありません。個別に貸主・行政・消防・金融機関・専門家等へ確認します。",
        "monthly": "月額",
        "initial": "初期費用概算",
        "area": "面積",
        "access": "交通",
        "floor": "階",
        "station": "架空駅",
        "walk": "徒歩{n}分",
        "page": "{current} / {total}",
        "ask": "気になる候補と優先条件を共有 → 最新募集状況と未確認事項を個別確認",
        "estimate": "概算値は比較用です。工事、設備、税、保険、保証会社、融資費用等を含まない場合があります。",
    },
    "en": {
        "sample": "PUBLIC SAMPLE / FICTIONAL",
        "candidate": "Option",
        "comparison": "Comparison of 8 options",
        "detail": "Option details",
        "first_fit": "Initial fit",
        "good": "Promising",
        "caution": "Conditional",
        "check": "Check needed",
        "confirmed": "Shown in source",
        "unconfirmed": "Confirm further",
        "not_applicable": "Not applicable",
        "plan": "Illustrative layout",
        "facts": "Core comparison facts",
        "checks": "Checks before contracting",
        "costs": "Cost / income view",
        "next": "Suggested next step",
        "cta": "Tell us your requirements. We will prepare a real candidate pack in this format.",
        "fictional": "All names, locations, prices, layouts and income figures are fictional examples. This is not an advertisement for available properties.",
        "no_guarantee": "This guide does not guarantee use approval, permits, designation, financing, returns or a contract. We verify each point with the owner, authorities, fire department, lender and relevant professionals.",
        "monthly": "Monthly",
        "initial": "Est. upfront",
        "area": "Area",
        "access": "Access",
        "floor": "Floor",
        "station": "Example Sta.",
        "walk": "{n} min walk",
        "page": "{current} / {total}",
        "ask": "Share preferred options and priorities → confirm current availability and open items",
        "estimate": "Estimates are for comparison and may exclude works, equipment, taxes, insurance, guarantor and financing costs.",
    },
    "zh-tw": {
        "sample": "公開範例 / 虛構案例",
        "candidate": "候選",
        "comparison": "8個候選物件比較",
        "detail": "候選物件詳情",
        "first_fit": "初步評估",
        "good": "較為適合",
        "caution": "附條件",
        "check": "需要確認",
        "confirmed": "資料已記載",
        "unconfirmed": "追加確認",
        "not_applicable": "不適用",
        "plan": "配置示意",
        "facts": "基本比較資訊",
        "checks": "簽約前確認事項",
        "costs": "費用・收支檢視",
        "next": "下一步",
        "cta": "請告訴我們您的需求，我們會以此格式製作實際候選物件資料。",
        "fictional": "物件名稱、所在地、金額、格局與收支均為說明用虛構案例，並非招租或出售廣告。",
        "no_guarantee": "本資料不保證用途同意、許可、指定、融資、收益或簽約成立；須另向屋主、主管機關、消防、金融機構及專業人士確認。",
        "monthly": "每月費用",
        "initial": "初期費用概算",
        "area": "面積",
        "access": "交通",
        "floor": "樓層",
        "station": "範例站",
        "walk": "步行{n}分鐘",
        "page": "{current} / {total}",
        "ask": "分享在意的候選與優先條件 → 個別確認最新招租狀況與未確認事項",
        "estimate": "概算僅供比較，可能不含工程、設備、稅金、保險、保證公司及融資費用等。",
    },
    "zh": {
        "sample": "公开示例 / 虚构案例",
        "candidate": "候选",
        "comparison": "8个候选物件对比",
        "detail": "候选物件详情",
        "first_fit": "初步评估",
        "good": "较为适合",
        "caution": "附带条件",
        "check": "需要确认",
        "confirmed": "资料已记载",
        "unconfirmed": "追加确认",
        "not_applicable": "不适用",
        "plan": "布局示意",
        "facts": "基本对比信息",
        "checks": "签约前确认事项",
        "costs": "费用・收支查看",
        "next": "下一步",
        "cta": "请告诉我们您的需求，我们会按此格式制作实际候选物件资料。",
        "fictional": "物件名称、所在地、金额、户型与收支均为说明用虚构案例，并非招租或出售广告。",
        "no_guarantee": "本资料不保证用途同意、许可、指定、融资、收益或签约成立；须另向业主、主管机关、消防、金融机构及专业人士确认。",
        "monthly": "每月费用",
        "initial": "初期费用概算",
        "area": "面积",
        "access": "交通",
        "floor": "楼层",
        "station": "示例站",
        "walk": "步行{n}分钟",
        "page": "{current} / {total}",
        "ask": "分享关注的候选与优先条件 → 分别确认最新招租状况与未确认事项",
        "estimate": "概算仅供比较，可能不含工程、设备、税费、保险、担保公司及融资费用等。",
    },
}


VARIANTS = {
    "welfare": {
        "slug": "property-search-sample",
        "title": {
            "ja": "通所系福祉施設の物件比較資料",
            "en": "Property Comparison for Day-Care Welfare Services",
            "zh-tw": "通所型福祉設施物件比較資料",
            "zh": "日间照护型福利设施物件对比资料",
        },
        "subtitle": {
            "ja": "放課後等デイサービス等を想定した、候補整理と確認事項の見本",
            "en": "A sample pack for comparing sites for after-school day services and similar operations",
            "zh-tw": "以課後等日間照護服務等為例的候選整理與確認事項",
            "zh": "以课后等日间照护服务等为例的候选整理与确认事项",
        },
        "table": {
            "ja": ["候補", "月額", "初期概算", "面積", "交通", "階", "用途確認"],
            "en": ["Option", "Monthly", "Upfront", "Area", "Access", "Floor", "Use check"],
            "zh-tw": ["候選", "每月", "初期概算", "面積", "交通", "樓層", "用途確認"],
            "zh": ["候选", "每月", "初期概算", "面积", "交通", "楼层", "用途确认"],
        },
        "criteria": {
            "ja": ["活動室と相談室", "送迎・乗降", "水回りと動線", "貸主・建築・消防"],
            "en": ["Activity & consultation rooms", "Pick-up / drop-off", "Water & circulation", "Owner / building / fire checks"],
            "zh-tw": ["活動室與諮詢室", "接送與上下車", "用水與動線", "屋主・建築・消防"],
            "zh": ["活动室与咨询室", "接送与上下车", "用水与动线", "业主・建筑・消防"],
        },
        "checks": {
            "ja": ["福祉施設利用の貸主承諾", "活動室等の必要面積", "相談・事務スペース", "送迎車の停車動線", "避難経路・消防設備", "用途地域・建築用途"],
            "en": ["Owner consent for welfare use", "Required activity-room area", "Consultation / admin space", "Vehicle stopping flow", "Evacuation and fire equipment", "Zoning and building use"],
            "zh-tw": ["屋主同意福祉設施用途", "活動室等必要面積", "諮詢・辦公空間", "接送車停靠動線", "避難路線・消防設備", "土地使用分區・建築用途"],
            "zh": ["业主同意福利设施用途", "活动室等必要面积", "咨询・办公空间", "接送车停靠动线", "疏散路线・消防设备", "土地用途分区・建筑用途"],
        },
        "zones": {
            "ja": ["活動室", "相談", "事務", "水回り", "入口・送迎"],
            "en": ["Activity", "Consult", "Admin", "Water", "Entry / pick-up"],
            "zh-tw": ["活動室", "諮詢", "辦公", "用水區", "入口・接送"],
            "zh": ["活动室", "咨询", "办公", "用水区", "入口・接送"],
        },
    },
    "group-home": {
        "slug": "group-home-sample",
        "title": {
            "ja": "障害者グループホームの物件比較資料",
            "en": "Property Comparison for a Disability Group Home",
            "zh-tw": "身心障礙者團體家屋物件比較資料",
            "zh": "残障者团体家屋物件对比资料",
        },
        "subtitle": {
            "ja": "居室・共用部・夜間動線・消防を、開設計画と照らして比べる見本",
            "en": "A sample for comparing bedrooms, shared spaces, night operations and fire-safety checks",
            "zh-tw": "對照開設計畫，比較居室、共用空間、夜間動線與消防事項",
            "zh": "结合开设计划，对比卧室、共用空间、夜间动线与消防事项",
        },
        "table": {
            "ja": ["候補", "月額", "居室", "延床", "最小居室", "浴室", "承諾"],
            "en": ["Option", "Monthly", "Rooms", "GFA", "Min room", "Bath", "Consent"],
            "zh-tw": ["候選", "每月", "居室", "總樓地板", "最小居室", "浴室", "同意"],
            "zh": ["候选", "每月", "卧室", "总建筑面积", "最小卧室", "浴室", "同意"],
        },
        "criteria": {
            "ja": ["居室数・居室面積", "食堂・居間", "浴室・便所", "夜間動線・消防"],
            "en": ["Bedrooms & room sizes", "Dining / living space", "Baths & toilets", "Night flow & fire safety"],
            "zh-tw": ["居室數・居室面積", "餐廳・起居室", "浴室・廁所", "夜間動線・消防"],
            "zh": ["卧室数・卧室面积", "餐厅・起居室", "浴室・卫生间", "夜间动线・消防"],
        },
        "checks": {
            "ja": ["共同生活援助利用の貸主承諾", "各居室の有効面積", "食堂・居間の広さ", "浴室・便所・洗面の数", "夜間の支援動線", "用途・避難・消防設備"],
            "en": ["Owner consent for group-home use", "Usable area of each bedroom", "Dining / living area", "Bath / toilet / washbasin count", "Night support circulation", "Use, evacuation and fire equipment"],
            "zh-tw": ["屋主同意共同生活援助用途", "各居室有效面積", "餐廳・起居室面積", "浴室・廁所・洗面數量", "夜間支援動線", "用途・避難・消防設備"],
            "zh": ["业主同意共同生活援助用途", "各卧室有效面积", "餐厅・起居室面积", "浴室・卫生间・洗面数量", "夜间支援动线", "用途・疏散・消防设备"],
        },
        "zones": {
            "ja": ["居室×4", "食堂・居間", "世話人室", "浴室", "玄関"],
            "en": ["4 bedrooms", "Dining / living", "Staff", "Bath", "Entry"],
            "zh-tw": ["居室×4", "餐廳・起居室", "工作人員室", "浴室", "玄關"],
            "zh": ["卧室×4", "餐厅・起居室", "工作人员室", "浴室", "玄关"],
        },
    },
    "office": {
        "slug": "office-sample",
        "title": {"ja": "オフィス移転の物件比較資料", "en": "Office Property Comparison", "zh-tw": "辦公室搬遷物件比較資料", "zh": "办公室搬迁物件对比资料"},
        "subtitle": {"ja": "登記・通信・会議室・働き方まで、賃料以外も並べて選ぶ見本", "en": "A sample that compares registration, connectivity, meeting space and ways of working", "zh-tw": "從公司登記、網路、會議室到工作方式，不只比較租金", "zh": "从公司登记、网络、会议室到办公方式，不只对比租金"},
        "table": {"ja": ["候補", "月額", "初期概算", "面積", "席数", "登記", "光回線"], "en": ["Option", "Monthly", "Upfront", "Area", "Seats", "Register", "Fiber"], "zh-tw": ["候選", "每月", "初期概算", "面積", "座位", "登記", "光纖"], "zh": ["候选", "每月", "初期概算", "面积", "座位", "登记", "光纤"]},
        "criteria": {"ja": ["法人登記・来客", "通信・電源", "会議・集中席", "空調・利用時間"], "en": ["Registration & visitors", "Internet & power", "Meetings & focus work", "HVAC & access hours"], "zh-tw": ["公司登記・訪客", "網路・電源", "會議・專注席", "空調・使用時間"], "zh": ["公司登记・访客", "网络・电源", "会议・专注座位", "空调・使用时间"]},
        "checks": {"ja": ["法人登記・看板掲出", "光回線の引込可否", "電源容量・OAフロア", "会議室の遮音", "個別空調・利用時間", "来客・搬出入ルール"], "en": ["Company registration and signage", "Fiber installation", "Power capacity / raised floor", "Meeting-room sound isolation", "Individual HVAC / access hours", "Visitor and delivery rules"], "zh-tw": ["公司登記與招牌", "光纖引入可否", "電力容量・架高地板", "會議室隔音", "獨立空調・使用時間", "訪客・搬運規則"], "zh": ["公司登记与招牌", "光纤引入可否", "电力容量・架空地板", "会议室隔音", "独立空调・使用时间", "访客・搬运规则"]},
        "zones": {"ja": ["執務席", "会議室", "集中席", "受付", "複合機"], "en": ["Workstations", "Meeting", "Focus", "Reception", "Printer"], "zh-tw": ["辦公座位", "會議室", "專注席", "接待區", "複合機"], "zh": ["办公座位", "会议室", "专注座位", "接待区", "复合机"]},
    },
    "restaurant": {
        "slug": "restaurant-sample",
        "title": {"ja": "飲食店出店の物件比較資料", "en": "Restaurant Property Comparison", "zh-tw": "餐飲店展店物件比較資料", "zh": "餐饮店开店物件对比资料"},
        "subtitle": {"ja": "厨房・排気・給排水・営業条件を、内見前から整理する見本", "en": "A sample for comparing kitchen, exhaust, utilities and operating conditions before viewing", "zh-tw": "在看屋前整理廚房、排氣、給排水與營業條件", "zh": "在看房前整理厨房、排烟、给排水与营业条件"},
        "table": {"ja": ["候補", "月額", "面積", "前用途", "排気", "GT", "深夜"], "en": ["Option", "Monthly", "Area", "Prior use", "Exhaust", "GT", "Late"], "zh-tw": ["候選", "每月", "面積", "前用途", "排氣", "GT", "深夜"], "zh": ["候选", "每月", "面积", "原用途", "排烟", "GT", "深夜"]},
        "criteria": {"ja": ["飲食店の承諾", "排気・ダクト", "給排水・GT", "電気・ガス・営業時間"], "en": ["Restaurant-use consent", "Exhaust / duct", "Water / grease trap", "Power / gas / hours"], "zh-tw": ["餐飲用途同意", "排氣・風管", "給排水・截油槽", "電力・瓦斯・營業時間"], "zh": ["餐饮用途同意", "排烟・风管", "给排水・隔油池", "电力・燃气・营业时间"]},
        "checks": {"ja": ["飲食店用途の貸主承諾", "屋上までの排気経路", "グリストラップ容量", "給排水・ガス・電気容量", "営業時間・臭気・音の制限", "造作譲渡と原状回復範囲"], "en": ["Owner consent for restaurant use", "Exhaust route to roof", "Grease-trap capacity", "Water, gas and electrical capacity", "Hours, odor and noise limits", "Fixtures transfer and reinstatement"], "zh-tw": ["屋主同意餐飲用途", "通往屋頂的排氣路徑", "截油槽容量", "給排水・瓦斯・電力容量", "營業時間・氣味・噪音限制", "設備讓渡與恢復原狀範圍"], "zh": ["业主同意餐饮用途", "通往屋顶的排烟路径", "隔油池容量", "给排水・燃气・电力容量", "营业时间・气味・噪音限制", "设备转让与恢复原状范围"]},
        "zones": {"ja": ["客席", "厨房", "洗い場", "倉庫", "入口・待機"], "en": ["Dining", "Kitchen", "Wash", "Storage", "Entry / wait"], "zh-tw": ["客席", "廚房", "清洗區", "倉庫", "入口・等候"], "zh": ["客席", "厨房", "清洗区", "仓库", "入口・等候"]},
    },
    "investment": {
        "slug": "investment-sample",
        "title": {"ja": "投資用不動産の比較資料", "en": "Investment Property Comparison", "zh-tw": "投資用不動產比較資料", "zh": "投资用不动产对比资料"},
        "subtitle": {"ja": "価格と表面利回りだけでなく、稼働・費用・修繕・出口まで並べる見本", "en": "A sample that compares occupancy, costs, repairs and exit assumptions beyond price and headline yield", "zh-tw": "除價格與表面報酬率外，也比較稼動、費用、修繕與退出假設", "zh": "除价格与表面收益率外，也对比出租率、费用、修缮与退出假设"},
        "table": {"ja": ["候補", "価格", "表面利回り", "稼働", "築年", "戸数", "修繕"], "en": ["Option", "Price", "Gross yield", "Occupancy", "Built", "Units", "Capex"], "zh-tw": ["候選", "價格", "表面報酬", "稼動", "屋齡", "戶數", "修繕"], "zh": ["候选", "价格", "表面收益", "出租率", "楼龄", "户数", "修缮"]},
        "criteria": {"ja": ["賃料と稼働", "運営費・NOI", "修繕・法令", "融資・出口"], "en": ["Rent & occupancy", "Opex & NOI", "Capex & compliance", "Financing & exit"], "zh-tw": ["租金與稼動", "營運費・NOI", "修繕・法規", "融資・退出"], "zh": ["租金与出租率", "运营费・NOI", "修缮・法规", "融资・退出"]},
        "checks": {"ja": ["レントロールと入金履歴", "空室・滞納・更新条件", "運営費とNOIの再計算", "修繕履歴・将来工事", "遵法性・管理状況", "融資条件・売却時の想定"], "en": ["Rent roll and payment history", "Vacancy, arrears and renewals", "Recalculated opex and NOI", "Repair history and future works", "Compliance and management", "Financing terms and exit assumptions"], "zh-tw": ["租金表與收款紀錄", "空置・欠租・續約條件", "重新計算營運費與NOI", "修繕紀錄・未來工程", "法規符合性・管理狀況", "融資條件・出售假設"], "zh": ["租金表与收款记录", "空置・欠租・续约条件", "重新计算运营费与NOI", "修缮记录・未来工程", "合规性・管理状况", "融资条件・出售假设"]},
        "zones": {"ja": ["住戸・区画", "共用部", "管理", "修繕", "出口想定"], "en": ["Units", "Common", "Management", "Capex", "Exit view"], "zh-tw": ["住戶・區畫", "共用部", "管理", "修繕", "退出假設"], "zh": ["住户・区划", "共用部", "管理", "修缮", "退出假设"]},
    },
}


@dataclass
class Candidate:
    letter: str
    summary: list[str]
    facts: list[tuple[str, str]]
    costs: list[tuple[str, str]]
    statuses: list[int]


def money_yen(value: int, locale: str) -> str:
    man = value / 10000
    amount = f"{int(man):,}" if man.is_integer() else f"{man:,.1f}"
    if locale == "ja":
        return f"{amount}万円"
    if locale in ("zh-tw", "zh"):
        return f"¥{amount}萬"
    return f"¥{value:,}"


def candidates_for(kind: str, locale: str) -> list[Candidate]:
    t = I18N[locale]
    rows: list[Candidate] = []
    for idx, letter in enumerate("ABCDEFGH"):
        area = 72 + idx * 9
        rent = 238000 + idx * 17000
        walk = [4, 7, 9, 5, 8, 6, 10, 3][idx]
        status = [0, 1, 2, 0, 1, 2][idx % 6]
        access = f"{t['station']} / {t['walk'].format(n=walk)}"
        if kind == "investment":
            price = 58000000 + idx * 6500000
            yield_pct = 4.6 + idx * 0.35
            occupancy = [100, 92, 83, 100, 88, 96, 75, 90][idx]
            built = 2003 + idx * 2
            units = 4 + (idx % 5)
            capex = ["Low", "Mid", "Check", "Low", "Mid", "Check", "High", "Mid"][idx]
            localized_capex = {
                "ja": {"Low": "小", "Mid": "中", "Check": "要確認", "High": "大"},
                "en": {"Low": "Low", "Mid": "Mid", "Check": "Check", "High": "High"},
                "zh-tw": {"Low": "小", "Mid": "中", "Check": "待確認", "High": "大"},
                "zh": {"Low": "小", "Mid": "中", "Check": "待确认", "High": "大"},
            }[locale][capex]
            summary = [f"{t['candidate']} {letter}", money_yen(price, locale), f"{yield_pct:.1f}%", f"{occupancy}%", str(built), str(units), localized_capex]
            facts = [
                (VARIANTS[kind]["table"][locale][1], money_yen(price, locale)),
                (VARIANTS[kind]["table"][locale][2], f"{yield_pct:.1f}%"),
                (VARIANTS[kind]["table"][locale][3], f"{occupancy}%"),
                (VARIANTS[kind]["table"][locale][4], str(built)),
                (VARIANTS[kind]["table"][locale][5], str(units)),
                (t["access"], access),
            ]
            gross = int(price * yield_pct / 100)
            noi = int(gross * (0.69 - (idx % 3) * 0.03))
            costs = [
                (VARIANTS[kind]["table"][locale][1], money_yen(price, locale)),
                ("Gross annual rent" if locale == "en" else "想定年間賃料" if locale == "ja" else "預估年租金" if locale == "zh-tw" else "预计年租金", money_yen(gross, locale)),
                ("Illustrative NOI" if locale == "en" else "NOI試算" if locale == "ja" else "NOI試算", money_yen(noi, locale)),
                ("Reserve assumption" if locale == "en" else "修繕予備費" if locale == "ja" else "修繕預備費" if locale == "zh-tw" else "修缮预备费", money_yen(500000 + idx * 80000, locale)),
            ]
        elif kind == "group-home":
            rooms = 4 + (idx % 4)
            min_room = 7.5 + (idx % 3) * 0.6
            bath = [1, 1, 2, 1, 2, 1, 2, 2][idx]
            consent = [t["confirmed"], t["unconfirmed"], t["unconfirmed"], t["confirmed"], t["unconfirmed"], t["confirmed"], t["unconfirmed"], t["confirmed"]][idx]
            summary = [f"{t['candidate']} {letter}", money_yen(rent, locale), str(rooms), f"{area + 35}㎡", f"{min_room:.1f}㎡", str(bath), consent]
            facts = [(t["monthly"], money_yen(rent, locale)), ("Bedrooms" if locale == "en" else "居室数" if locale == "ja" else "居室數" if locale == "zh-tw" else "卧室数", str(rooms)), ("Gross floor area" if locale == "en" else "延床面積" if locale == "ja" else "總樓地板面積" if locale == "zh-tw" else "总建筑面积", f"{area + 35}㎡"), ("Smallest room" if locale == "en" else "最小居室" if locale == "ja" else "最小居室" if locale == "zh-tw" else "最小卧室", f"{min_room:.1f}㎡"), (t["access"], access), (t["floor"], f"{1 + idx % 3}F")]
            costs = [(t["monthly"], money_yen(rent, locale)), (t["initial"], money_yen(rent * (5 + idx % 3), locale)), ("Fit-out allowance" if locale == "en" else "改修予算枠" if locale == "ja" else "改修預算" if locale == "zh-tw" else "改造预算", money_yen(2500000 + idx * 300000, locale)), ("Fire works" if locale == "en" else "消防工事" if locale == "ja" else "消防工程", t["unconfirmed"])]
        elif kind == "office":
            seats = 8 + idx * 2
            registered = t["confirmed"] if idx not in (2, 6) else t["unconfirmed"]
            fiber = t["confirmed"] if idx % 3 else t["unconfirmed"]
            summary = [f"{t['candidate']} {letter}", money_yen(rent, locale), money_yen(rent * (4 + idx % 3), locale), f"{area}㎡", str(seats), registered, fiber]
            facts = [(t["monthly"], money_yen(rent, locale)), (t["area"], f"{area}㎡"), ("Workstations" if locale == "en" else "想定席数" if locale == "ja" else "預估座位" if locale == "zh-tw" else "预计座位", str(seats)), ("Registration" if locale == "en" else "法人登記" if locale == "ja" else "公司登記", registered), (t["access"], access), (t["floor"], f"{2 + idx}F")]
            costs = [(t["monthly"], money_yen(rent, locale)), (t["initial"], money_yen(rent * (4 + idx % 3), locale)), ("Network works" if locale == "en" else "通信工事" if locale == "ja" else "網路工程" if locale == "zh-tw" else "网络工程", t["unconfirmed"]), ("Furniture" if locale == "en" else "什器" if locale == "ja" else "辦公家具" if locale == "zh-tw" else "办公家具", t["unconfirmed"])]
        elif kind == "restaurant":
            prior_values = {
                "ja": ["軽飲食", "事務所", "居酒屋", "物販", "カフェ", "重飲食", "美容室", "スケルトン"],
                "en": ["Cafe", "Office", "Izakaya", "Retail", "Cafe", "Restaurant", "Salon", "Shell"],
                "zh-tw": ["輕餐飲", "辦公室", "居酒屋", "零售", "咖啡店", "重餐飲", "美容院", "毛胚"],
                "zh": ["轻餐饮", "办公室", "居酒屋", "零售", "咖啡店", "重餐饮", "美容院", "毛坯"],
            }[locale]
            exhaust = t["confirmed"] if idx in (0, 2, 4, 5) else t["unconfirmed"]
            gt = t["confirmed"] if idx in (2, 5) else t["unconfirmed"]
            late = t["confirmed"] if idx in (2, 5, 7) else t["unconfirmed"]
            summary = [f"{t['candidate']} {letter}", money_yen(rent, locale), f"{area}㎡", prior_values[idx], exhaust, gt, late]
            facts = [(t["monthly"], money_yen(rent, locale)), (t["area"], f"{area}㎡"), (VARIANTS[kind]["table"][locale][3], prior_values[idx]), ("Exhaust" if locale == "en" else "排気" if locale == "ja" else "排氣" if locale == "zh-tw" else "排烟", exhaust), (t["access"], access), (t["floor"], "1F" if idx < 5 else "2F")]
            costs = [(t["monthly"], money_yen(rent, locale)), (t["initial"], money_yen(rent * (6 + idx % 3), locale)), ("Fixtures transfer" if locale == "en" else "造作譲渡" if locale == "ja" else "設備讓渡" if locale == "zh-tw" else "设备转让", money_yen(idx * 400000, locale) if idx in (2, 4, 5) else t["not_applicable"]), ("Utility works" if locale == "en" else "設備工事" if locale == "ja" else "設備工程" if locale == "zh-tw" else "设备工程", t["unconfirmed"])]
        else:
            use_check = t["confirmed"] if idx in (0, 3, 6) else t["unconfirmed"]
            summary = [f"{t['candidate']} {letter}", money_yen(rent, locale), money_yen(rent * (5 + idx % 2), locale), f"{area}㎡", t["walk"].format(n=walk), f"{1 + idx % 3}F", use_check]
            facts = [(t["monthly"], money_yen(rent, locale)), (t["initial"], money_yen(rent * (5 + idx % 2), locale)), (t["area"], f"{area}㎡"), (t["access"], access), (t["floor"], f"{1 + idx % 3}F"), (VARIANTS[kind]["table"][locale][-1], use_check)]
            costs = [(t["monthly"], money_yen(rent, locale)), (t["initial"], money_yen(rent * (5 + idx % 2), locale)), ("Fit-out" if locale == "en" else "改装工事" if locale == "ja" else "裝修工程" if locale == "zh-tw" else "装修工程", t["unconfirmed"]), ("Fire works" if locale == "en" else "消防工事" if locale == "ja" else "消防工程", t["unconfirmed"])]
        rows.append(Candidate(letter, summary, facts, costs, [(status + j) % 3 for j in range(6)]))
    return rows


def paragraph(text: str, size: float = 8, color=TEXT, leading: float | None = None, align=TA_LEFT, bold: bool = False) -> Paragraph:
    style = ParagraphStyle(
        name="p",
        fontName="YotsubaSans",
        fontSize=size,
        leading=leading or size * 1.35,
        textColor=color,
        alignment=align,
        spaceAfter=0,
        spaceBefore=0,
    )
    safe = escape(str(text))
    if bold:
        safe = f"<b>{safe}</b>"
    return Paragraph(safe, style)


def draw_header(c: canvas.Canvas, title: str, sample: str, page: int, total: int, locale: str) -> None:
    width, height = A4
    c.setFillColor(GREEN)
    c.rect(0, height - 18 * mm, width, 18 * mm, fill=1, stroke=0)
    if LOGO.exists():
        c.setFillColor(colors.white)
        c.roundRect(11 * mm, height - 15.2 * mm, 50 * mm, 12.3 * mm, 2 * mm, fill=1, stroke=0)
        c.drawImage(str(LOGO), 14 * mm, height - 14.2 * mm, width=44 * mm, height=12 * mm, preserveAspectRatio=True, mask="auto", anchor="w")
    c.setFillColor(colors.white)
    c.setFont("YotsubaSans", 8)
    c.drawRightString(width - 15 * mm, height - 7.5 * mm, sample)
    c.setFont("YotsubaSans", 7)
    c.drawRightString(width - 15 * mm, height - 12 * mm, I18N[locale]["page"].format(current=page, total=total))
    c.setFillColor(GREEN_DARK)
    c.setFont("YotsubaSans", 8)
    c.drawString(15 * mm, 11 * mm, title)
    c.setFillColor(MUTED)
    c.setFont("YotsubaSans", 6.6)
    c.drawRightString(width - 15 * mm, 11 * mm, "luck428.com")


def draw_disclaimer(c: canvas.Canvas, locale: str, y: float, width: float = 180 * mm) -> None:
    c.setFillColor(colors.HexColor("#FFF3F6"))
    c.roundRect(15 * mm, y, width, 14 * mm, 3 * mm, fill=1, stroke=0)
    p = paragraph(I18N[locale]["fictional"], 7.2, PINK, leading=9)
    p.wrapOn(c, width - 8 * mm, 11 * mm)
    p.drawOn(c, 19 * mm, y + 3.2 * mm)


def draw_cover(c: canvas.Canvas, kind: str, locale: str, candidates: list[Candidate]) -> None:
    width, height = A4
    v = VARIANTS[kind]
    t = I18N[locale]
    draw_header(c, v["title"][locale], t["sample"], 1, 9, locale)
    title = paragraph(v["title"][locale], 23, INK, leading=28, bold=True)
    title.wrapOn(c, 180 * mm, 30 * mm)
    title.drawOn(c, 15 * mm, height - 48 * mm)
    subtitle = paragraph(v["subtitle"][locale], 10.5, TEXT, leading=15)
    subtitle.wrapOn(c, 178 * mm, 18 * mm)
    subtitle.drawOn(c, 15 * mm, height - 63 * mm)

    chip_y = height - 82 * mm
    chip_w = 42.75 * mm
    for i, label in enumerate(v["criteria"][locale]):
        x = 15 * mm + i * (chip_w + 3 * mm)
        c.setFillColor(MINT)
        c.roundRect(x, chip_y, chip_w, 16 * mm, 3 * mm, fill=1, stroke=0)
        p = paragraph(label, 7.2, GREEN_DARK, leading=9, align=TA_CENTER, bold=True)
        _, ph = p.wrap(chip_w - 4 * mm, 12 * mm)
        p.drawOn(c, x + 2 * mm, chip_y + (16 * mm - ph) / 2)

    c.setFillColor(INK)
    c.setFont("YotsubaSans", 13)
    c.drawString(15 * mm, height - 95 * mm, t["comparison"])
    data = [[paragraph(x, 6.8, colors.white, align=TA_CENTER, bold=True) for x in v["table"][locale]]]
    for cand in candidates:
        data.append([paragraph(x, 6.4, INK, leading=8, align=TA_CENTER, bold=i == 0) for i, x in enumerate(cand.summary)])
    col_widths = [22, 27, 27, 24, 30, 18, 32]
    col_widths = [x * mm for x in col_widths]
    table = Table(data, colWidths=col_widths, rowHeights=[10 * mm] + [11.2 * mm] * 8)
    style = [
        ("BACKGROUND", (0, 0), (-1, 0), GREEN),
        ("BACKGROUND", (0, 1), (-1, -1), colors.white),
        ("ROWBACKGROUNDS", (0, 1), (-1, -1), [colors.white, PAPER]),
        ("GRID", (0, 0), (-1, -1), 0.35, BORDER),
        ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
        ("LEFTPADDING", (0, 0), (-1, -1), 2),
        ("RIGHTPADDING", (0, 0), (-1, -1), 2),
        ("TOPPADDING", (0, 0), (-1, -1), 2),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 2),
    ]
    table.setStyle(TableStyle(style))
    tw, th = table.wrapOn(c, 180 * mm, 110 * mm)
    table.drawOn(c, 15 * mm, height - 100 * mm - th)
    draw_disclaimer(c, locale, 23 * mm)
    c.setFillColor(MUTED)
    note = paragraph(t["no_guarantee"], 6.8, MUTED, leading=9)
    note.wrapOn(c, 180 * mm, 12 * mm)
    note.drawOn(c, 15 * mm, 15 * mm)


def draw_zone_plan(c: canvas.Canvas, x: float, y: float, w: float, h: float, labels: list[str]) -> None:
    c.setStrokeColor(BORDER)
    c.setFillColor(colors.white)
    c.roundRect(x, y, w, h, 3 * mm, fill=1, stroke=1)
    boxes = [
        (x + 4 * mm, y + 24 * mm, w * .44, h - 28 * mm),
        (x + w * .49, y + 24 * mm, w * .24, h - 28 * mm),
        (x + w * .75, y + 24 * mm, w * .21 - 4 * mm, h - 28 * mm),
        (x + 4 * mm, y + 4 * mm, w * .40, 17 * mm),
        (x + w * .46, y + 4 * mm, w * .50 - 4 * mm, 17 * mm),
    ]
    fills = [MINT, colors.HexColor("#F4F8F6"), colors.HexColor("#FDEEF2"), colors.HexColor("#EEF4F8"), colors.HexColor("#F8F5EA")]
    for (bx, by, bw, bh), label, fill in zip(boxes, labels, fills):
        c.setFillColor(fill)
        c.setStrokeColor(BORDER)
        c.roundRect(bx, by, bw, bh, 2 * mm, fill=1, stroke=1)
        p = paragraph(label, 7, INK, leading=9, align=TA_CENTER, bold=True)
        _, ph = p.wrap(bw - 3 * mm, bh - 3 * mm)
        p.drawOn(c, bx + 1.5 * mm, by + (bh - ph) / 2)


def draw_detail(c: canvas.Canvas, kind: str, locale: str, cand: Candidate, index: int) -> None:
    width, height = A4
    v = VARIANTS[kind]
    t = I18N[locale]
    draw_header(c, v["title"][locale], t["sample"], index + 2, 9, locale)
    c.setFillColor(MINT)
    c.roundRect(15 * mm, height - 54 * mm, 180 * mm, 25 * mm, 4 * mm, fill=1, stroke=0)
    c.setFillColor(GREEN_DARK)
    c.setFont("YotsubaSans", 20)
    c.drawString(21 * mm, height - 43 * mm, f"{t['candidate']} {cand.letter}")
    fit_key = ["good", "caution", "check"][index % 3]
    badge_color = [GREEN, AMBER, PINK][index % 3]
    c.setFillColor(badge_color)
    c.roundRect(135 * mm, height - 47.5 * mm, 52 * mm, 12 * mm, 6 * mm, fill=1, stroke=0)
    c.setFillColor(colors.white)
    c.setFont("YotsubaSans", 7.5)
    c.drawCentredString(161 * mm, height - 43 * mm, f"{t['first_fit']}: {t[fit_key]}")

    c.setFillColor(INK)
    c.setFont("YotsubaSans", 11)
    c.drawString(15 * mm, height - 67 * mm, t["facts"])
    facts = [[paragraph(k, 6.8, MUTED, bold=True), paragraph(vv, 8.4, INK, bold=True)] for k, vv in cand.facts]
    facts_table = Table(facts, colWidths=[30 * mm, 57 * mm], rowHeights=[10 * mm] * 6)
    facts_table.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (0, -1), PAPER),
        ("BACKGROUND", (1, 0), (1, -1), colors.white),
        ("GRID", (0, 0), (-1, -1), 0.35, BORDER),
        ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
        ("LEFTPADDING", (0, 0), (-1, -1), 5),
    ]))
    facts_table.wrapOn(c, 87 * mm, 64 * mm)
    facts_table.drawOn(c, 15 * mm, height - 133 * mm)

    c.setFillColor(INK)
    c.setFont("YotsubaSans", 11)
    c.drawString(108 * mm, height - 67 * mm, t["plan"])
    draw_zone_plan(c, 108 * mm, height - 133 * mm, 87 * mm, 60 * mm, v["zones"][locale])

    c.setFillColor(INK)
    c.setFont("YotsubaSans", 11)
    c.drawString(15 * mm, height - 147 * mm, t["checks"])
    status_labels = [t["confirmed"], t["unconfirmed"], t["not_applicable"]]
    status_colors = [GREEN, AMBER, MUTED]
    y = height - 158 * mm
    for j, (label, status) in enumerate(zip(v["checks"][locale], cand.statuses)):
        row_y = y - j * 12 * mm
        c.setFillColor(PAPER if j % 2 else colors.white)
        c.roundRect(15 * mm, row_y, 112 * mm, 9.5 * mm, 2 * mm, fill=1, stroke=0)
        c.setFillColor(status_colors[status])
        c.circle(20 * mm, row_y + 4.8 * mm, 1.5 * mm, fill=1, stroke=0)
        p = paragraph(label, 7.5, TEXT, leading=9.5)
        p.wrapOn(c, 79 * mm, 8 * mm)
        p.drawOn(c, 24 * mm, row_y + 1.2 * mm)
        p2 = paragraph(status_labels[status], 6.6, status_colors[status], leading=8, align=TA_CENTER, bold=True)
        p2.wrapOn(c, 22 * mm, 8 * mm)
        p2.drawOn(c, 103 * mm, row_y + 1.4 * mm)

    c.setFillColor(INK)
    c.setFont("YotsubaSans", 11)
    c.drawString(133 * mm, height - 147 * mm, t["costs"])
    costs = [[paragraph(k, 6.5, MUTED, bold=True), paragraph(vv, 7.5, INK, bold=True)] for k, vv in cand.costs]
    costs_table = Table(costs, colWidths=[28 * mm, 34 * mm], rowHeights=[11 * mm] * 4)
    costs_table.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, -1), colors.white),
        ("ROWBACKGROUNDS", (0, 0), (-1, -1), [colors.white, PAPER]),
        ("GRID", (0, 0), (-1, -1), 0.35, BORDER),
        ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
        ("LEFTPADDING", (0, 0), (-1, -1), 4),
    ]))
    costs_table.wrapOn(c, 62 * mm, 50 * mm)
    costs_table.drawOn(c, 133 * mm, height - 197 * mm)
    est = paragraph(t["estimate"], 6.4, MUTED, leading=8)
    est.wrapOn(c, 62 * mm, 22 * mm)
    est.drawOn(c, 133 * mm, height - 216 * mm)

    c.setFillColor(GREEN)
    c.roundRect(15 * mm, 37 * mm, 180 * mm, 20 * mm, 4 * mm, fill=1, stroke=0)
    c.setFillColor(colors.white)
    c.setFont("YotsubaSans", 7)
    c.drawString(21 * mm, 51 * mm, t["next"])
    p = paragraph(t["ask"], 8.4, colors.white, leading=11, bold=True)
    p.wrapOn(c, 168 * mm, 12 * mm)
    p.drawOn(c, 21 * mm, 40 * mm)
    draw_disclaimer(c, locale, 20 * mm)


def filename(kind: str, locale: str) -> str:
    slug = VARIANTS[kind]["slug"]
    if kind == "welfare" and locale == "ja":
        return f"{slug}.pdf"
    return f"{slug}-{locale}.pdf"


def preview_filename(kind: str, locale: str) -> str:
    slug = VARIANTS[kind]["slug"].replace("-sample", "")
    if kind == "welfare" and locale == "ja":
        return "preview.webp"
    return f"{slug}-preview-{locale}.webp"


def create_pdf(kind: str, locale: str) -> Path:
    OUT.mkdir(parents=True, exist_ok=True)
    target = OUT / filename(kind, locale)
    c = canvas.Canvas(str(target), pagesize=A4, pageCompression=1)
    c.setTitle(VARIANTS[kind]["title"][locale])
    c.setAuthor("四葉不動産株式会社 / Yotsuba Real Estate")
    c.setSubject(I18N[locale]["fictional"])
    candidates = candidates_for(kind, locale)
    draw_cover(c, kind, locale, candidates)
    c.showPage()
    for i, cand in enumerate(candidates):
        draw_detail(c, kind, locale, cand, i)
        c.showPage()
    c.save()
    return target


def create_preview(pdf_path: Path, kind: str, locale: str) -> Path:
    import pypdfium2 as pdfium

    doc = pdfium.PdfDocument(str(pdf_path))
    page = doc[0]
    bitmap = page.render(scale=1.9)
    pil = bitmap.to_pil().convert("RGB")
    preview = OUT / preview_filename(kind, locale)
    pil.save(preview, "WEBP", quality=84, method=6)
    page.close()
    doc.close()
    return preview


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--kind", choices=[*VARIANTS, "all"], default="all")
    parser.add_argument("--locale", choices=[*LOCALES, "all"], default="all")
    args = parser.parse_args()
    if not FONT_PATH.exists():
        raise SystemExit(f"Font not found: {FONT_PATH}")
    pdfmetrics.registerFont(TTFont("YotsubaSans", str(FONT_PATH)))
    kinds = list(VARIANTS) if args.kind == "all" else [args.kind]
    locales = list(LOCALES) if args.locale == "all" else [args.locale]
    outputs: list[Path] = []
    for kind in kinds:
        for locale in locales:
            pdf = create_pdf(kind, locale)
            preview = create_preview(pdf, kind, locale)
            outputs.extend([pdf, preview])
            print(f"created {pdf.relative_to(ROOT)}")
            print(f"created {preview.relative_to(ROOT)}")
    print(f"OK: {len(outputs) // 2} PDFs and {len(outputs) // 2} previews")


if __name__ == "__main__":
    main()
