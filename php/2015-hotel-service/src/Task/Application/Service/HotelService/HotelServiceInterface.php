<?php

namespace Task\Application\Service\HotelService;

/**
 * The implementation is responsible for resolving the id of the city from the
 * given city name (in this simple case via an array of CityName => id). The second 
 * responsibility is to sort the returning result from the partner service in whatever
 * way. 
 * 
 * This breaks with the rule of the separation of concerns, but for this test case we want to
 * keep it simple.
 *
 * @author mmueller
 */
interface HotelServiceInterface
{
    /**
     * @param string $sCityName Name of the city to search for.
     *
     * @return \Task\Application\Entity\Hotel[]
     * @throws \InvalidArgumentException if city name is unknown.
     */
    public function getHotelsForCity($sCityName);
}