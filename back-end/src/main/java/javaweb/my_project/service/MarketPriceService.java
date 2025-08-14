package javaweb.my_project.service;

import javaweb.my_project.dto.market_price.MarketPriceCreationRequest;
import javaweb.my_project.dto.market_price.MarketPriceResponse;
import javaweb.my_project.dto.market_price.MarketPriceUpdateRequest;
import javaweb.my_project.entities.MarketPrice;
import javaweb.my_project.entities.Product;
import javaweb.my_project.exception.AppException;
import javaweb.my_project.mapper.MarketPriceMapper;
import javaweb.my_project.repository.MarketPriceRepository;
import javaweb.my_project.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class MarketPriceService {
    private final MarketPriceMapper marketPriceMapper;
    private final MarketPriceRepository marketPriceRepository;
    private final ProductRepository productRepository;

    @Transactional
    public MarketPriceResponse create(MarketPriceCreationRequest request) {
        Product product = findProductById(request.getProductId());
        MarketPrice marketPrice = marketPriceMapper.toMarketPrice(request);
        marketPrice.setProduct(product);
        marketPriceRepository.save(marketPrice);
        return marketPriceMapper.toMarketPriceResponse(marketPrice);
    }

    public MarketPriceResponse findById(String id) {
        MarketPrice marketPrice = marketPriceRepository.findById(id)
                .orElseThrow(
                        () -> new AppException(HttpStatus.NOT_FOUND, "Market price not found", "market-price-e-01"));
        return marketPriceMapper.toMarketPriceResponse(marketPrice);
    }

    public List<MarketPriceResponse> findAll() {
        List<MarketPrice> marketPrices = marketPriceRepository.findAll();
        marketPrices.sort((MarketPrice mp1, MarketPrice mp2) -> mp1.getDateRecorded().compareTo(mp2.getDateRecorded()));
        return marketPriceMapper.toListMarketResponse(marketPrices);
    }

    @Transactional
    public MarketPriceResponse updatePatch(String id, MarketPriceUpdateRequest request) {
        MarketPrice marketPrice = marketPriceRepository.findById(id)
                .orElseThrow(
                        () -> new AppException(HttpStatus.NOT_FOUND, "Market price not found", "market-price-e-01"));
        if (request.getProductId() != null) {
            Product product = findProductById(request.getProductId());
            marketPrice.setProduct(product);
        }
        if (request.getPrice() != null) {
            marketPrice.setPrice(request.getPrice());
        }
        if (request.getRegion() != null) {
            marketPrice.setRegion(request.getRegion());
        }
        if (request.getDateRecorded() != null) {
            marketPrice.setDateRecorded(request.getDateRecorded());
        }
        marketPriceRepository.save(marketPrice);
        return marketPriceMapper.toMarketPriceResponse(marketPrice);
    }

    public void deleteById(String id) {
        MarketPrice marketPrice = marketPriceRepository.findById(id)
                .orElseThrow(
                        () -> new AppException(HttpStatus.NOT_FOUND, "Market price not found", "market-price-e-01"));
        marketPriceRepository.delete(marketPrice);
    }

    public Product findProductById(String productId) {
        return productRepository.findById(productId)
                .orElseThrow(() -> new AppException(HttpStatus.NOT_FOUND, "Product not found", "product-e-01"));
    }
}
