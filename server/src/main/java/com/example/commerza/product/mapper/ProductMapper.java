package com.example.commerza.product.mapper;


import com.example.commerza.product.dto.CreateProductRequest;
import com.example.commerza.product.dto.ProductResponse;
import com.example.commerza.product.dto.UpdateProductRequest;
import com.example.commerza.product.entity.Product;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface ProductMapper {

    Product toEntity(CreateProductRequest request);

    @Mapping(source = "category.id", target = "categoryId")
    ProductResponse toResponse(Product product);

    void updateProductFromRequest(UpdateProductRequest request, @MappingTarget Product product);
}
