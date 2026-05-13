"""
데이터 로드 모듈
"""

from app.services.db_service import get_connection
import re


def extract_grades_from_organization(organization: str) -> list[int]:
    """organization 문자열에서 학년 숫자 추출
    예: '컴퓨터공학과3' → [3]
        '컴퓨터공학과/컴퓨터공학부(컴퓨터공학전공)3' → [3]
        '컴퓨터공학과1' → [1]
    """
    if not organization:
        return []
    
    parts = organization.split('/')
    grades = set()

    for part in parts:
        part = part.strip()
        m = re.search(r'([1-4])$', part)
        if not m:
            continue
        
        target_grade = int(m.group(1))
        
        # 리버럴아츠칼리지는 해당 학년 이상 모두 수강 가능
        if "리버럴아츠칼리지" in part:
            for g in range(target_grade, 5):  # N ~ 4
                grades.add(g)
        else:
            # 그 외는 정확히 그 학년만
            grades.add(target_grade)
    
    return sorted(grades)

def load_courses(major_id: int = None):
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)

    try:
        # COURSE_MAJORS와 LEFT JOIN, GROUP_CONCAT으로 다대다 처리
        cursor.execute("""
            SELECT c.course_id, c.course_code, c.course_name,
                   c.classification, c.credits, c.professor, c.capacity,
                   c.organization,
                   GROUP_CONCAT(cm.major_id) AS major_ids
            FROM COURSES c
            LEFT JOIN COURSE_MAJORS cm ON c.course_id = cm.course_id
            GROUP BY c.course_id
        """)
        courses = cursor.fetchall()

        # major_ids 문자열을 리스트로 변환
        for course in courses:
            if course["major_ids"]:
                course["major_ids"] = [
                    int(mid) for mid in course["major_ids"].split(",")
                ]
            else:
                course["major_ids"] = []
            
            course["grades"] = extract_grades_from_organization(
                course["organization"]
            )

        # 스케줄 로드
        cursor.execute("""
            SELECT cs.schedule_id, cs.course_id, cs.day_of_week,
                   cs.start_period, cs.end_period,
                   cs.building_id, cs.room_name,
                   b.building_name
            FROM COURSE_SCHEDULES cs
            LEFT JOIN BUILDINGS b ON cs.building_id = b.building_id
        """)
        schedules = cursor.fetchall()

        schedule_map = {}
        for s in schedules:
            cid = s["course_id"]
            if cid not in schedule_map:
                schedule_map[cid] = []
            schedule_map[cid].append(s)

        for course in courses:
            course["schedules"] = schedule_map.get(course["course_id"], [])

        return courses

    finally:
        cursor.close()
        conn.close()


def load_distances():
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)

    try:
        cursor.execute("""
            SELECT from_building_id, to_building_id, time_minutes, is_uphill
            FROM DISTANCES
        """)
        rows = cursor.fetchall()

        distance_map = {}
        for row in rows:
            key = (row["from_building_id"], row["to_building_id"])
            distance_map[key] = {
                "time_minutes": row["time_minutes"],
                "is_uphill": bool(row["is_uphill"]),
            }

        return distance_map

    finally:
        cursor.close()
        conn.close()


def load_buildings():
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)

    try:
        cursor.execute("SELECT building_id, building_name FROM BUILDINGS")
        rows = cursor.fetchall()
        return {row["building_id"]: row["building_name"] for row in rows}

    finally:
        cursor.close()
        conn.close()