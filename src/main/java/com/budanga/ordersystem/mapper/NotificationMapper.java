package com.budanga.ordersystem.mapper;

import com.budanga.ordersystem.dto.NotificationDTO;
import com.budanga.ordersystem.entity.Notification;
import org.mapstruct.Mapper;
import java.util.List;

@Mapper(componentModel = "spring")
public interface NotificationMapper {
    NotificationDTO toDTO(Notification notification);
    List<NotificationDTO> toDTOList(List<Notification> notifications);
}
