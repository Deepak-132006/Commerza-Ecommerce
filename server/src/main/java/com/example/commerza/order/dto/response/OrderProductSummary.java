package com.example.commerza.order.dto.response;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderProductSummary {

    private Long productId;

    private String productName;

    private String productImage;
}
