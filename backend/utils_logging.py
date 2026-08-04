from typing import Optional
from sqlalchemy.orm import Session
import models
from datetime import datetime, timezone

def log_activity(
    db: Session,
    action: str,
    details: str,
    user: Optional[models.User] = None,
    entity_type: Optional[str] = None,
    entity_id: Optional[str] = None,
    ip_address: Optional[str] = None
):
    """
    Utility function to write activity logs to the database.
    Catches errors silently to ensure logging failures do not block business actions.
    """
    try:
        user_role = "GUEST"
        if user:
            if hasattr(user.role, 'value'):
                user_role = user.role.value
            else:
                user_role = str(user.role)

        log_entry = models.ActivityLog(
            action=action,
            details=details,
            entity_type=entity_type,
            entity_id=entity_id,
            ip_address=ip_address,
            user_id=user.id if user else None,
            user_email=user.email if user else "guest@jobportal.com",
            user_role=user_role
        )
        db.add(log_entry)
        db.commit()
    except Exception as e:
        db.rollback()
        print(f"Failed to write activity log to DB: {e}")
