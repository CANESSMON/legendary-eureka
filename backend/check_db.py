from database import engine
from sqlalchemy import text

with engine.connect() as conn:
    count = conn.execute(text("SELECT COUNT(*) FROM job_postings")).fetchone()[0]
    print(f"Job postings in DB: {count}")
    
    if count > 0:
        rows = conn.execute(text("SELECT id, title, company, status FROM job_postings LIMIT 5")).fetchall()
        print("\nSample jobs:")
        for r in rows:
            print(f"  [{r[3]}] {r[1]} @ {r[2]}  (id: {r[0][:8]}...)")
    else:
        print("DB is empty — seed has not been run yet.")
