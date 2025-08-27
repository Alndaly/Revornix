import schemas
import crud
from common.sql import SessionLocal
from typing import Protocol
from enums.notification import NotificationSourceCategory, NotificationTargetCategory

class NotifyProtocol(Protocol):
    
    source: schemas.notification.NotificationSourceDetail | None = None
    target: schemas.notification.NotificationTargetDetail | None = None
    
    def __init__(self, 
                 notify_uuid: str,
                 notify_name: str, 
                 notify_name_zh: str,
                 notify_description: str | None = None, 
                 notify_description_zh: str | None = None,
                 source_id: int | None = None, 
                 target_id: int | None = None):
        db = SessionLocal()
        self.notify_uuid = notify_uuid
        self.notify_name = notify_name
        self.notify_name_zh = notify_name_zh
        self.notify_description = notify_description
        self.notify_description_zh = notify_description_zh
        self.source_id = source_id
        self.target_id = target_id
        db_notification_source = crud.notification.get_notification_source_by_notification_source_id(db=db,
                                                                                                     notification_source_id=source_id)
        db_notification_target = crud.notification.get_notification_target_by_notification_target_id(db=db,
                                                                                                     notification_target_id=target_id)
        if db_notification_source is None or db_notification_target is None:
            raise schemas.error.CustomException(message="notification source or target not found", code=404)
        
        if db_notification_source.category == NotificationSourceCategory.EMAIL:
            db_notification_email_source = crud.notification.get_email_notification_source_by_notification_source_id(db=db,
                                                                                                                     notification_source_id=db_notification_source.id)
            self.source = schemas.notification.NotificationSourceDetail(
                id=db_notification_source.id,
                title=db_notification_source.title,
                description=db_notification_source.description,
                category=db_notification_source.category,
                email_notification_source=schemas.notification.EmailNotificationSource(
                    id=db_notification_email_source.id,
                    email=db_notification_email_source.email,
                    password=db_notification_email_source.password,
                    port=db_notification_email_source.port,
                    server=db_notification_email_source.server,
                )
            )
        if db_notification_source.category == NotificationSourceCategory.IOS:
            db_notification_ios_source = crud.notification.get_ios_notification_source_by_notification_source_id(db=db,
                                                                                                                 notification_source_id=db_notification_source.id)  
            self.source = schemas.notification.NotificationSourceDetail(
                id=db_notification_source.id,
                title=db_notification_source.title,
                description=db_notification_source.description,
                category=db_notification_source.category,
                ios_notification_source=schemas.notification.IOSNotificationSource(
                    id=db_notification_ios_source.id,
                    team_id=db_notification_ios_source.team_id,
                    key_id=db_notification_ios_source.key_id,
                    private_key=db_notification_ios_source.private_key,
                    app_bundle_id=db_notification_ios_source.app_bundle_id,
                )
            )
            
        if db_notification_target.category == NotificationTargetCategory.EMAIL:
            db_notification_email_target = crud.notification.get_email_notification_target_by_notification_target_id(db=db,
                                                                                                                     notification_target_id=db_notification_target.id)
            self.target = schemas.notification.NotificationTargetDetail(
                id=db_notification_target.id,
                title=db_notification_target.title,
                description=db_notification_target.description,
                category=db_notification_target.category,
                email_notification_target=schemas.notification.EmailNotificationTarget(
                    id=db_notification_email_target.id,
                    email=db_notification_email_target.email,
                )
            )
        if db_notification_target.category == NotificationTargetCategory.IOS:
            db_notification_ios_target = crud.notification.get_ios_notification_target_by_notification_target_id(db=db,
                                                                                                                 notification_target_id=db_notification_target.id)
            self.target = schemas.notification.NotificationTargetDetail(
                id=db_notification_target.id,
                title=db_notification_target.title,
                description=db_notification_target.description,
                category=db_notification_target.category,
                ios_notification_target=schemas.notification.IOSNotificationTarget(
                    id=db_notification_ios_target.id,
                    device_token=db_notification_ios_target.device_token,
                )
            )
        
        
    def send_notification(self, message: schemas.notification.Message) -> bool:
        raise NotImplementedError("Method not implemented")