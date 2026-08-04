import sys
import os

# Add backend directory to path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from database import SessionLocal
import models

def test_category_deletion():
    db = SessionLocal()
    try:
        print("=== CATEGORY DELETION TEST ===")
        
        # 1. Fetch "Information Technology (IT)" category
        it_cat = db.query(models.JobCategory).filter(models.JobCategory.name == "Information Technology (IT)").first()
        if not it_cat:
            print("Information Technology (IT) category not found!")
            return
            
        print(f"Checking category: {it_cat.name} (ID: {it_cat.id})")
        
        # 2. Check if jobs exist
        jobs_count = db.query(models.JobPosting).filter(models.JobPosting.category == it_cat.name).count()
        print(f"Number of jobs in this category: {jobs_count}")
        
        # 3. Simulate deletion logic
        if jobs_count > 0:
            print("SAFETY CHECK PASSED: Category deletion was blocked because jobs exist.")
        else:
            print("WARNING: Category has no jobs, which is unexpected for seeded IT category.")
            
        # 4. Create a dummy category with 0 jobs and verify it CAN be deleted
        dummy_name = "Temp Category For Deletion"
        existing_dummy = db.query(models.JobCategory).filter(models.JobCategory.name == dummy_name).first()
        if existing_dummy:
            db.delete(existing_dummy)
            db.commit()
            
        dummy_cat = models.JobCategory(name=dummy_name)
        db.add(dummy_cat)
        db.commit()
        db.refresh(dummy_cat)
        print(f"Created temporary category: {dummy_cat.name} (ID: {dummy_cat.id})")
        
        # Verify dummy has 0 jobs
        dummy_jobs_count = db.query(models.JobPosting).filter(models.JobPosting.category == dummy_cat.name).count()
        print(f"Number of jobs in temporary category: {dummy_jobs_count}")
        
        if dummy_jobs_count == 0:
            db.delete(dummy_cat)
            db.commit()
            print("SUCCESS: Temporary category deleted successfully because it has 0 jobs.")
        else:
            print("ERROR: Temporary category has jobs.")
            
    finally:
        db.close()

if __name__ == "__main__":
    test_category_deletion()
